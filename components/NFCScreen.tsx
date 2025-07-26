import { useNFC } from "@/hooks/useNFC";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

export const NFCScreen = () => {
  const {
    isSupported,
    isEnabled,
    isScanning,
    scannedCards,
    startScan,
    stopScan,
    clearScannedCards,
    writeToNFC,
  } = useNFC();

  const [writeData, setWriteData] = useState("");

  const handleStartScan = () => {
    if (isScanning) {
      stopScan();
    } else {
      startScan();
    }
  };

  const handleWriteToNFC = () => {
    if (!writeData.trim()) {
      Alert.alert("Error", "Please enter data to write");
      return;
    }
    writeToNFC(writeData);
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">NFC Manager</ThemedText>
        <ThemedText type="subtitle">
          {isSupported ? "NFC is supported" : "NFC is not supported"}
        </ThemedText>
        <ThemedText type="subtitle">
          {isEnabled ? "NFC is enabled" : "NFC is disabled"}
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Scan NFC Cards</ThemedText>
        <TouchableOpacity
          style={[styles.button, isScanning && styles.buttonScanning]}
          onPress={handleStartScan}
          disabled={!isSupported || !isEnabled}
        >
          <ThemedText style={styles.buttonText}>
            {isScanning ? "Stop Scanning" : "Start Scanning"}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Write to NFC</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Enter data to write to NFC card"
          value={writeData}
          onChangeText={setWriteData}
          multiline
        />
        <TouchableOpacity
          style={[styles.button, styles.buttonWrite]}
          onPress={handleWriteToNFC}
          disabled={!isSupported || !isEnabled}
        >
          <ThemedText style={styles.buttonText}>Write to NFC</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle">
            Scanned Cards ({scannedCards.length})
          </ThemedText>
          {scannedCards.length > 0 && (
            <TouchableOpacity onPress={clearScannedCards}>
              <ThemedText style={styles.clearButton}>Clear All</ThemedText>
            </TouchableOpacity>
          )}
        </View>

        {scannedCards.length === 0 ? (
          <ThemedText style={styles.emptyText}>
            No cards scanned yet. Start scanning to see results.
          </ThemedText>
        ) : (
          scannedCards.map((card, index) => (
            <ThemedView key={index} style={styles.cardItem}>
              <ThemedText type="defaultSemiBold">Card ID: {card.id}</ThemedText>
              <ThemedText>Type: {card.type}</ThemedText>
              <ThemedText>Time: {formatTimestamp(card.timestamp)}</ThemedText>
              {card.data && (
                <ThemedText numberOfLines={3} style={styles.cardData}>
                  Data: {card.data}
                </ThemedText>
              )}
            </ThemedView>
          ))
        )}
      </ThemedView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
    padding: 16,
    borderRadius: 8,
  },
  section: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 8,
    gap: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#007AFF",
  },
  buttonScanning: {
    backgroundColor: "#FF3B30",
  },
  buttonWrite: {
    backgroundColor: "#34C759",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    textAlignVertical: "top",
  },
  cardItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    gap: 4,
  },
  cardData: {
    fontSize: 12,
    opacity: 0.7,
  },
  clearButton: {
    color: "#FF3B30",
    fontWeight: "600",
  },
  emptyText: {
    textAlign: "center",
    opacity: 0.6,
    fontStyle: "italic",
  },
});
