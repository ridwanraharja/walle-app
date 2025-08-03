import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function CreatePaymentScreen() {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [merchantName, setMerchantName] = useState("Walle Stores");

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    if (numericValue === "") return "";

    const formattedValue = new Intl.NumberFormat("id-ID").format(
      parseInt(numericValue)
    );
    return `Rp ${formattedValue}`;
  };

  const handleAmountChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    setAmount(numericValue);
  };

  const handleCreatePayment = () => {
    if (!amount || !merchantName) {
      Alert.alert("Error", "Please fill in amount and merchant name");
      return;
    }

    const numericAmount = parseInt(amount);
    if (numericAmount < 1000) {
      Alert.alert("Error", "Minimum amount is Rp 1,000");
      return;
    }

    router.push({
      pathname: "/scan-card",
      params: {
        amount: amount,
        description: description,
        merchantName: merchantName,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Payment</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          <View style={styles.amountSection}>
            <Text style={styles.amountLabel}>Payment Amount</Text>
            <View style={styles.amountContainer}>
              <Text style={styles.currencySymbol}>Rp</Text>
              <TextInput
                style={styles.amountInput}
                value={formatCurrency(amount).replace("Rp ", "")}
                onChangeText={handleAmountChange}
                placeholder="0"
                keyboardType="numeric"
                maxLength={15}
              />
            </View>
            <Text style={styles.amountDisplay}>{formatCurrency(amount)}</Text>
          </View>

          <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>Payment Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Amount:</Text>
              <Text style={styles.summaryValue}>
                {amount ? formatCurrency(amount) : "Rp 0"}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Merchant:</Text>
              <Text style={styles.summaryValue}>{merchantName || "-"}</Text>
            </View>
            {description && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Description:</Text>
                <Text style={styles.summaryValue}>{description}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.createButton,
              (!amount || !merchantName) && styles.createButtonDisabled,
            ]}
            onPress={handleCreatePayment}
            disabled={!amount || !merchantName}
          >
            <Text style={styles.createButtonText}>Continue to Payment</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  keyboardAvoid: {
    flex: 1,
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
  amountSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
  },
  amountLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
    marginBottom: 16,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    marginRight: 8,
  },
  amountInput: {
    fontSize: 32,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
    minWidth: 100,
  },
  amountDisplay: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  inputSection: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e1e5e9",
  },
  descriptionInput: {
    height: 80,
    textAlignVertical: "top",
  },
  summarySection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    flex: 2,
    textAlign: "right",
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e1e5e9",
  },
  createButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  createButtonDisabled: {
    backgroundColor: "#ccc",
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
