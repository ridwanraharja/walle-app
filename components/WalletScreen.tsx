import { useNFC } from "@/hooks/useNFC";
import { useWalletCards } from "@/hooks/useWalletCards";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { NFCCard, WalletCard } from "./NFCCard";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

export const WalletScreen = () => {
  const {
    walletCards,
    selectedCard,
    setSelectedCard,
    toggleCardActive,
    addCard,
    removeCard,
    getTotalBalance,
  } = useWalletCards();

  const { startScan, isScanning, scannedCards } = useNFC();
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [newCardData, setNewCardData] = useState({
    name: "",
    balance: "",
    currency: "IDR",
    cardType: "debit" as const,
  });

  const handleAddCard = () => {
    if (!newCardData.name || !newCardData.balance) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    addCard({
      ...newCardData,
      lastUsed: new Date(),
      isActive: true,
    });

    setNewCardData({
      name: "",
      balance: "",
      currency: "IDR",
      cardType: "debit",
    });
    setShowAddCardModal(false);
  };

  const handleCardPress = (card: WalletCard) => {
    setSelectedCard(card);
    Alert.alert(
      card.name,
      `Balance: ${card.balance} ${card.currency}\nType: ${
        card.cardType
      }\nLast used: ${card.lastUsed.toLocaleDateString()}`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove Card",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Remove Card",
              `Are you sure you want to remove ${card.name}?`,
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Remove",
                  style: "destructive",
                  onPress: () => removeCard(card.id),
                },
              ]
            );
          },
        },
      ]
    );
  };

  const handleScanNFC = () => {
    if (isScanning) {
      Alert.alert(
        "Scanning in Progress",
        "Please wait for the current scan to complete."
      );
      return;
    }
    startScan();
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">My Wallet</ThemedText>
        <ThemedText type="subtitle">
          Total Balance: {getTotalBalance().toLocaleString()} IDR
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.addButton]}
          onPress={() => setShowAddCardModal(true)}
        >
          <ThemedText style={styles.actionButtonText}>Add Card</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.scanButton,
            isScanning && styles.scanningButton,
          ]}
          onPress={handleScanNFC}
        >
          <ThemedText style={styles.actionButtonText}>
            {isScanning ? "Scanning..." : "Scan NFC"}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>


      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">My Cards ({walletCards.length})</ThemedText>

        {walletCards.length === 0 ? (
          <ThemedText style={styles.emptyText}>
            No cards added yet. Add your first card to get started.
          </ThemedText>
        ) : (
          walletCards.map((card) => (
            <NFCCard
              key={card.id}
              card={card}
              onPress={() => handleCardPress(card)}
              onToggleActive={() => toggleCardActive(card.id)}
            />
          ))
        )}
      </ThemedView>

      {scannedCards.length > 0 && (
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">
            Recently Scanned NFC ({scannedCards.length})
          </ThemedText>
          {scannedCards.slice(0, 3).map((scannedCard, index) => (
            <ThemedView key={index} style={styles.scannedCard}>
              <ThemedText type="defaultSemiBold">
                Card ID: {scannedCard.id}
              </ThemedText>
              <ThemedText>Type: {scannedCard.type}</ThemedText>
              <ThemedText>
                Time: {new Date(scannedCard.timestamp).toLocaleString()}
              </ThemedText>
            </ThemedView>
          ))}
        </ThemedView>
      )}

      {/* Add Card Modal */}
      <Modal
        visible={showAddCardModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddCardModal(false)}
      >
        <View style={styles.modalOverlay}>
          <ThemedView style={styles.modalContent}>
            <ThemedText type="title" style={styles.modalTitle}>
              Add New Card
            </ThemedText>

            <TextInput
              style={styles.input}
              placeholder="Card Name"
              value={newCardData.name}
              onChangeText={(text) =>
                setNewCardData((prev) => ({ ...prev, name: text }))
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Balance"
              value={newCardData.balance}
              onChangeText={(text) =>
                setNewCardData((prev) => ({ ...prev, balance: text }))
              }
              keyboardType="numeric"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAddCardModal(false)}
              >
                <ThemedText style={styles.modalButtonText}>Cancel</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddCard}
              >
                <ThemedText style={styles.modalButtonText}>Save</ThemedText>
              </TouchableOpacity>
            </View>
          </ThemedView>
        </View>
      </Modal>
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
  actions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#2ECC71",
  },
  scanButton: {
    backgroundColor: "#3498DB",
  },
  scanningButton: {
    backgroundColor: "#E74C3C",
  },
  actionButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 8,
    gap: 12,
  },
  emptyText: {
    textAlign: "center",
    opacity: 0.6,
    fontStyle: "italic",
  },
  scannedCard: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    gap: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    padding: 24,
    borderRadius: 12,
    gap: 16,
  },
  modalTitle: {
    textAlign: "center",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#95A5A6",
  },
  saveButton: {
    backgroundColor: "#2ECC71",
  },
  modalButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
