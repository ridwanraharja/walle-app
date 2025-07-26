import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

export interface WalletCard {
  id: string;
  name: string;
  balance: string;
  currency: string;
  cardType: "credit" | "debit" | "prepaid";
  lastUsed: Date;
  isActive: boolean;
}

interface NFCCardProps {
  card: WalletCard;
  onPress?: () => void;
  onToggleActive?: () => void;
}

export const NFCCard: React.FC<NFCCardProps> = ({
  card,
  onPress,
  onToggleActive,
}) => {
  const getCardTypeColor = () => {
    switch (card.cardType) {
      case "credit":
        return "#FF6B6B";
      case "debit":
        return "#4ECDC4";
      case "prepaid":
        return "#45B7D1";
      default:
        return "#95A5A6";
    }
  };

  const getCardTypeIcon = () => {
    switch (card.cardType) {
      case "credit":
        return "💳";
      case "debit":
        return "🏦";
      case "prepaid":
        return "💰";
      default:
        return "💳";
    }
  };

  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress}>
      <ThemedView
        style={[styles.card, { borderLeftColor: getCardTypeColor() }]}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardInfo}>
            <ThemedText type="defaultSemiBold" style={styles.cardName}>
              {card.name}
            </ThemedText>
            <ThemedText style={styles.cardType}>
              {getCardTypeIcon()} {card.cardType.toUpperCase()}
            </ThemedText>
          </View>
          <View style={styles.cardStatus}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: card.isActive ? "#2ECC71" : "#E74C3C" },
              ]}
            />
            <ThemedText style={styles.statusText}>
              {card.isActive ? "Active" : "Inactive"}
            </ThemedText>
          </View>
        </View>

        <View style={styles.cardBody}>
          <ThemedText type="title" style={styles.balance}>
            {card.balance}
          </ThemedText>
          <ThemedText style={styles.currency}>{card.currency}</ThemedText>
        </View>

        <View style={styles.cardFooter}>
          <ThemedText style={styles.lastUsed}>
            Last used: {card.lastUsed.toLocaleDateString()}
          </ThemedText>
          {onToggleActive && (
            <TouchableOpacity
              style={[
                styles.toggleButton,
                { backgroundColor: card.isActive ? "#E74C3C" : "#2ECC71" },
              ]}
              onPress={onToggleActive}
            >
              <ThemedText style={styles.toggleButtonText}>
                {card.isActive ? "Deactivate" : "Activate"}
              </ThemedText>
            </TouchableOpacity>
          )}
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 18,
    marginBottom: 4,
  },
  cardType: {
    fontSize: 14,
    opacity: 0.7,
  },
  cardStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  cardBody: {
    alignItems: "center",
    marginBottom: 12,
  },
  balance: {
    fontSize: 24,
    fontWeight: "bold",
  },
  currency: {
    fontSize: 16,
    opacity: 0.7,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lastUsed: {
    fontSize: 12,
    opacity: 0.6,
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  toggleButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
});
