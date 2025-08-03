import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import NfcManager from "react-native-nfc-manager";

const { width } = Dimensions.get("window");

export default function ScanCardScreen() {
  const params = useLocalSearchParams();
  const { amount, description, merchantName } = params as {
    amount: string;
    description: string;
    merchantName: string;
  };

  const [isScanning, setIsScanning] = useState(false);
  const [cardDetected, setCardDetected] = useState(false);
  const [cardInfo, setCardInfo] = useState<any>(null);
  const [scanAnimation] = useState(new Animated.Value(0));

  const formatCurrency = (value: string) => {
    const numericValue = parseInt(value);
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(numericValue);
  };

  useEffect(() => {
    // initNFC();
    // return () => {
    //   cleanUp();
    // };
  }, []);

  useEffect(() => {
    // if (isScanning) {
    //   startScanAnimation();
    // } else {
    //   stopScanAnimation();
    // }
  }, [isScanning]);

  const initNFC = async () => {
    try {
      const supported = await NfcManager.isSupported();
      if (!supported) {
        Alert.alert("Error", "This device does not support NFC");
        return;
      }

      await NfcManager.start();
    } catch (ex) {
      console.warn("NFC initialization failed:", ex);
      Alert.alert("Error", "Failed to initialize NFC");
    }
  };

  const cleanUp = () => {
    NfcManager.cancelTechnologyRequest().catch(() => 0);
  };

  const startScanAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnimation, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnimation, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopScanAnimation = () => {
    scanAnimation.stopAnimation();
    scanAnimation.setValue(0);
  };

  const readNdefTag = async () => {
    try {
      setIsScanning(true);

      // await NfcManager.requestTechnology(NfcTech.Ndef);

      // const tag = await NfcManager.getTag();
      const tag = "test";
      console.log("Tag found:", tag);

      if (tag) {
        const mockCardInfo = {
          cardNumber: "**** **** **** 1234",
          cardType: "Debit",
          bankName: "Bank Digital",
          cardholderName: "JOHN DOE",
          expiryDate: "12/25",
        };

        setCardInfo(mockCardInfo);
        setCardDetected(true);
        setIsScanning(false);

        setTimeout(() => {
          router.push({
            pathname: "/pin-modal",
            params: {
              amount,
              description,
              merchantName,
              cardInfo: JSON.stringify(mockCardInfo),
            },
          });
        }, 1500);
      }
    } catch (ex) {
      console.warn("NFC read failed:", ex);
      setIsScanning(false);
      Alert.alert("Error", "Failed to read card. Please try again.");
    } finally {
      cleanUp();
    }
  };

  const handleManualInput = () => {
    Alert.alert(
      "Manual Input",
      "Manual input feature is not available yet. Please use NFC scan.",
      [{ text: "OK" }]
    );
  };

  const scanOpacity = scanAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  const scanScale = scanAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan Card</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {/* Payment Info */}
        <View style={styles.paymentInfo}>
          <Text style={styles.paymentLabel}>Payment for:</Text>
          <Text style={styles.merchantName}>{merchantName}</Text>
          <Text style={styles.amount}>{formatCurrency(amount)}</Text>
          {description && <Text style={styles.description}>{description}</Text>}
        </View>

        {/* Scan Area */}
        <View style={styles.scanSection}>
          <View style={styles.scanArea}>
            <Animated.View
              style={[
                styles.scanCircle,
                {
                  opacity: scanOpacity,
                  transform: [{ scale: scanScale }],
                },
              ]}
            >
              <View style={styles.cardIcon}>
                <Ionicons
                  name={cardDetected ? "checkmark-circle" : "card"}
                  size={60}
                  color={cardDetected ? "#28a745" : "#007AFF"}
                />
              </View>
            </Animated.View>

            <Text style={styles.scanInstruction}>
              {cardDetected
                ? "Card detected!"
                : isScanning
                ? "Scanning..."
                : "Place card on this area"}
            </Text>

            {cardDetected && cardInfo && (
              <View style={styles.cardInfoContainer}>
                <Text style={styles.cardNumber}>{cardInfo.cardNumber}</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        {/* <TouchableOpacity
          style={styles.manualButton}
          onPress={handleManualInput}
        >
          <Text style={styles.manualButtonText}>Input Manual</Text>
        </TouchableOpacity> */}

        <TouchableOpacity
          style={[
            styles.scanButton,
            isScanning && styles.scanButtonActive,
            cardDetected && styles.scanButtonSuccess,
          ]}
          onPress={readNdefTag}
          disabled={isScanning || cardDetected}
        >
          <Text style={styles.scanButtonText}>
            {cardDetected
              ? "Card Detected"
              : isScanning
              ? "Scanning..."
              : "Start Scan"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e5e9",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  paymentInfo: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    alignItems: "center",
  },
  paymentLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  merchantName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  amount: {
    fontSize: 24,
    fontWeight: "700",
    color: "#007AFF",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  scanSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scanArea: {
    alignItems: "center",
    justifyContent: "center",
  },
  scanCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#f0f7ff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#007AFF",
    borderStyle: "dashed",
    marginBottom: 20,
  },
  cardIcon: {
    padding: 20,
  },
  scanInstruction: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
    marginBottom: 16,
  },
  cardInfoContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e1e5e9",
  },
  cardNumber: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
    letterSpacing: 2,
  },
  cardDetails: {
    fontSize: 14,
    color: "#666",
  },
  instructionsContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
  },
  instructionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 12,
    flex: 1,
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e1e5e9",
    gap: 12,
  },
  manualButton: {
    backgroundColor: "#6c757d",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  manualButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  scanButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  scanButtonActive: {
    backgroundColor: "#ffc107",
  },
  scanButtonSuccess: {
    backgroundColor: "#28a745",
  },
  scanButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
