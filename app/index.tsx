import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function WelcomeScreen() {
  const handleCreatePayment = () => {
    router.push("/create-payment");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          {/* <View style={styles.logoContainer}> */}
          <Image
            source={require("../assets/images/walle-logo.png")} // Update path as needed
            style={styles.imageIcon}
          />
          {/* </View> */}
          <Text style={styles.title}>EDC Payment</Text>
          <Text style={styles.subtitle}>
            Digital payment system for merchants
          </Text>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <TouchableOpacity
            style={[styles.featureButton, styles.primaryButton]}
            onPress={handleCreatePayment}
          >
            <View style={styles.buttonIconContainer}>
              <Ionicons name="card-outline" size={32} color="#fff" />
            </View>
            <Text style={styles.buttonTitle}>Create Payment</Text>
            <Text style={styles.buttonSubtitle}>
              Create new payment transaction
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Walle Wallet EDC System v1.0</Text>
      </View>
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
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 50,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f0f7ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 3,
    borderColor: "#007AFF",
  },
  imageIcon: {
    marginBottom: 24,
    marginTop: 24,
    width: 100,
    height: 80,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
  featuresSection: {
    gap: 16,
    marginBottom: 40,
  },
  featureButton: {
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    minHeight: 140,
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: "#007AFF",
  },
  secondaryButton: {
    backgroundColor: "#34C759",
  },
  buttonIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  buttonSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    lineHeight: 18,
  },
  infoSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    gap: 16,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  footer: {
    padding: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#999",
    fontWeight: "500",
  },
});
