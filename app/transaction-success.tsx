import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  SafeAreaView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function TransactionSuccessScreen() {
  const params = useLocalSearchParams();
  const { amount, description, merchantName, cardInfo, transactionId } =
    params as {
      amount: string;
      description: string;
      merchantName: string;
      cardInfo: string;
      transactionId: string;
    };

  const [scaleAnimation] = useState(new Animated.Value(0));
  const [fadeAnimation] = useState(new Animated.Value(0));

  const cardData = cardInfo ? JSON.parse(cardInfo) : null;
  const currentDate = new Date();

  const formatCurrency = (value: string) => {
    const numericValue = parseInt(value);
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(numericValue);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
  };

  const formatTransactionId = (id: string) => {
    return id
      .replace(/(.{4})/g, "$1 ")
      .trim()
      .toUpperCase();
  };

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnimation, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleShareReceipt = async () => {
    try {
      const receiptText = `
📧 PAYMENT RECEIPT 📧

💳 Payment successful!
💰 Amount: ${formatCurrency(amount)}
🏪 Merchant: ${merchantName}
${description ? `📝 Description: ${description}\n` : ""}
💳 Card: ${cardData?.cardNumber || "-"}
🏦 Bank: ${cardData?.bankName || "-"}
🆔 Transaction ID: ${formatTransactionId(transactionId)}
📅 Date: ${formatDate(currentDate)}

Thank you for using our service!
      `.trim();

      await Share.share({
        message: receiptText,
        title: "Payment Receipt",
      });
    } catch (error) {
      Alert.alert("Error", "Failed to share payment receipt");
    }
  };

  const handleNewTransaction = () => {
    router.replace("/create-payment");
  };

  const handleBackToHome = () => {
    router.replace("/");
  };

  const handleViewHistory = () => {
    Alert.alert(
      "Transaction History",
      "Transaction history feature will be available soon",
      [{ text: "OK" }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Success Animation */}
        <Animated.View
          style={[
            styles.successSection,
            {
              transform: [{ scale: scaleAnimation }],
              opacity: fadeAnimation,
            },
          ]}
        >
          <View style={styles.successIcon}>
            {/* Replace Ionicons with Image */}
            <Image
              source={require("../assets/images/success.png")} // Update path as needed
              style={styles.imageIcon}
            />
          </View>

          <Text style={styles.successTitle}>Payment Successful!</Text>
          <Text style={styles.successSubtitle}>
            Your transaction has been processed successfully
          </Text>
        </Animated.View>
      </View>

      {/* Action Buttons */}
      <Animated.View
        style={[styles.buttonContainer, { opacity: fadeAnimation }]}
      >
        {/* <TouchableOpacity
          style={styles.shareButton}
          onPress={handleShareReceipt}
        >
          <Ionicons name="share-outline" size={20} color="#007AFF" />
          <Text style={styles.shareButtonText}>Share Receipt</Text>
        </TouchableOpacity> */}

        <View style={styles.primaryButtons}>
          {/* <TouchableOpacity
            style={styles.historyButton}
            onPress={handleViewHistory}
          >
            <Text style={styles.historyButtonText}>View History</Text>
          </TouchableOpacity> */}

          <TouchableOpacity
            style={styles.newTransactionButton}
            onPress={handleNewTransaction}
          >
            <Text style={styles.newTransactionButtonText}>New Transaction</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.homeButton} onPress={handleBackToHome}>
          <Text style={styles.homeButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  successSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  successIcon: {
    marginBottom: 16,
  },
  imageIcon: {
    width: 80,
    height: 80,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#28a745",
    textAlign: "center",
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
  detailsSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  amountContainer: {
    alignItems: "center",
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e5e9",
    marginBottom: 20,
  },
  amountLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  amount: {
    fontSize: 32,
    fontWeight: "700",
    color: "#333",
  },
  infoContainer: {
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    flex: 1,
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 14,
    color: "#333",
    flex: 2,
    textAlign: "right",
    fontWeight: "500",
  },
  transactionId: {
    fontFamily: "monospace",
    fontSize: 13,
  },
  divider: {
    height: 1,
    backgroundColor: "#e1e5e9",
    marginVertical: 8,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#d4edda",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  statusText: {
    fontSize: 14,
    color: "#28a745",
    fontWeight: "500",
    marginLeft: 8,
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e1e5e9",
    gap: 12,
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f7ff",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  shareButtonText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "600",
    marginLeft: 8,
  },
  primaryButtons: {
    flexDirection: "row",
    gap: 12,
  },
  historyButton: {
    flex: 1,
    backgroundColor: "#6c757d",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
  },
  historyButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  newTransactionButton: {
    flex: 1,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
  },
  newTransactionButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  homeButton: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e1e5e9",
  },
  homeButtonText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
  },
});
