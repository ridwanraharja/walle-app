import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";

export default function PinModalScreen() {
  const params = useLocalSearchParams();
  const { amount, description, merchantName, cardInfo } = params as {
    amount: string;
    description: string;
    merchantName: string;
    cardInfo: string;
  };

  const [pin, setPin] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 3;

  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const pinInputs = useRef<(TextInput | null)[]>([]).current;

  const cardData = cardInfo ? JSON.parse(cardInfo) : null;

  const formatCurrency = (value: string) => {
    const numericValue = parseInt(value);
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(numericValue);
  };

  useEffect(() => {
    if (pinInputs[0]) {
      pinInputs[0].focus();
    }
  }, []);

  const shakeError = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePinInput = (value: string, index: number) => {
    if (value.length > 1) return;

    const newPin = pin.split("");
    newPin[index] = value;

    while (newPin.length < 6) {
      newPin.push("");
    }

    const updatedPin = newPin.slice(0, 6).join("");
    setPin(updatedPin);

    if (value && index < 5) {
      pinInputs[index + 1]?.focus();
    }

    if (updatedPin.replace(/\s/g, "").length === 6) {
      handleVerifyPin(updatedPin);
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !pin[index] && index > 0) {
      pinInputs[index - 1]?.focus();
    }
  };

  const handleVerifyPin = async (pinCode: string) => {
    setIsProcessing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (pinCode === "123456") {
        router.replace({
          pathname: "/transaction-success",
          params: {
            amount,
            description,
            merchantName,
            cardInfo,
            transactionId: Date.now().toString(),
          },
        });
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        Vibration.vibrate(500);
        shakeError();

        if (newAttempts >= maxAttempts) {
          Alert.alert(
            "PIN Blocked",
            "You have tried PIN 3 times. Card is temporarily blocked.",
            [
              {
                text: "OK",
                onPress: () => router.back(),
              },
            ]
          );
        } else {
          Alert.alert(
            "Wrong PIN",
            `The PIN you entered is incorrect. Remaining attempts: ${
              maxAttempts - newAttempts
            }`,
            [{ text: "Try Again" }]
          );
          clearPin();
        }
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while verifying PIN");
    } finally {
      setIsProcessing(false);
    }
  };

  const clearPin = () => {
    setPin("");
    pinInputs[0]?.focus();
  };

  const handleCancel = () => {
    Alert.alert(
      "Cancel Transaction",
      "Are you sure you want to cancel this transaction?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: () => router.back(),
        },
      ]
    );
  };

  const renderPinInputs = () => {
    return Array.from({ length: 6 }, (_, index) => (
      <TextInput
        key={index}
        ref={(ref) => {
          pinInputs[index] = ref;
        }}
        style={[styles.pinInput, pin[index] && styles.pinInputFilled]}
        value={pin[index] || ""}
        onChangeText={(value) => handlePinInput(value, index)}
        onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
        keyboardType="numeric"
        maxLength={1}
        secureTextEntry
        selectTextOnFocus
        editable={!isProcessing}
      />
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancel}
          disabled={isProcessing}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Enter PIN</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {/* Transaction Info */}
        <View style={styles.transactionInfo}>
          <View style={styles.lockIcon}>
            <Ionicons name="lock-closed" size={32} color="#007AFF" />
          </View>

          <Text style={styles.instruction}>Enter PIN to complete payment</Text>

          <View style={styles.paymentDetails}>
            <Text style={styles.amount}>{formatCurrency(amount)}</Text>
            <Text style={styles.merchant}>to {merchantName}</Text>
            {description && (
              <Text style={styles.description}>{description}</Text>
            )}
          </View>

          {/* Card Info */}
          {cardData && (
            <View style={styles.cardInfoSection}>
              <Text style={styles.cardInfoLabel}>Card used:</Text>
              <View style={styles.cardInfo}>
                <Text style={styles.cardNumber}>{cardData.cardNumber}</Text>
              </View>
            </View>
          )}
        </View>

        {/* PIN Input */}
        <Animated.View
          style={[
            styles.pinSection,
            { transform: [{ translateX: shakeAnimation }] },
          ]}
        >
          <Text style={styles.pinLabel}>PIN (6 digits)</Text>
          <View style={styles.pinContainer}>{renderPinInputs()}</View>

          {attempts > 0 && (
            <Text style={styles.errorText}>
              Wrong PIN. Remaining attempts: {maxAttempts - attempts}
            </Text>
          )}
        </Animated.View>

        {/* Processing State */}
        {isProcessing && (
          <View style={styles.processingContainer}>
            <View style={styles.processingContent}>
              <Text style={styles.processingText}>Verifying PIN...</Text>
              <View style={styles.loadingDots}>
                <View style={[styles.dot, styles.dotAnimation1]} />
                <View style={[styles.dot, styles.dotAnimation2]} />
                <View style={[styles.dot, styles.dotAnimation3]} />
              </View>
            </View>
          </View>
        )}
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
  cancelButton: {
    padding: 8,
  },
  cancelText: {
    fontSize: 16,
    color: "#dc3545",
    fontWeight: "500",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  placeholder: {
    width: 60,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  transactionInfo: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    alignItems: "center",
  },
  lockIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#f0f7ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  instruction: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
  },
  paymentDetails: {
    alignItems: "center",
    marginBottom: 16,
  },
  amount: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  merchant: {
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  cardInfoSection: {
    borderTopWidth: 1,
    borderTopColor: "#e1e5e9",
    paddingTop: 16,
    width: "100%",
    alignItems: "center",
  },
  cardInfoLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  cardInfo: {
    alignItems: "center",
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    letterSpacing: 2,
    marginBottom: 4,
  },
  cardDetails: {
    fontSize: 14,
    color: "#666",
  },
  pinSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    alignItems: "center",
  },
  pinLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 20,
  },
  pinContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  pinInput: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderColor: "#e1e5e9",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    backgroundColor: "#fff",
  },
  pinInputFilled: {
    borderColor: "#007AFF",
    backgroundColor: "#f0f7ff",
  },
  errorText: {
    fontSize: 14,
    color: "#dc3545",
    marginTop: 12,
    textAlign: "center",
  },
  processingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  processingContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    minWidth: 200,
  },
  processingText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 16,
  },
  loadingDots: {
    flexDirection: "row",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#007AFF",
  },
  dotAnimation1: {
    // Animation will be handled by CSS or native animations
  },
  dotAnimation2: {
    // Animation will be handled by CSS or native animations
  },
  dotAnimation3: {
    // Animation will be handled by CSS or native animations
  },
  securityInfo: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 16,
    gap: 12,
  },
  securityItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  securityText: {
    fontSize: 13,
    color: "#666",
  },
});
