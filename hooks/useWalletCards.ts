import { WalletCard } from "@/components/NFCCard";
import { useState } from "react";

// Mock data untuk demo
const mockWalletCards: WalletCard[] = [
  {
    id: "1",
    name: "BCA Debit Card",
    balance: "2,500,000",
    currency: "IDR",
    cardType: "debit",
    lastUsed: new Date("2024-01-15"),
    isActive: true,
  },
  {
    id: "2",
    name: "Mandiri Credit Card",
    balance: "5,000,000",
    currency: "IDR",
    cardType: "credit",
    lastUsed: new Date("2024-01-10"),
    isActive: false,
  },
  {
    id: "3",
    name: "GoPay Prepaid",
    balance: "150,000",
    currency: "IDR",
    cardType: "prepaid",
    lastUsed: new Date("2024-01-12"),
    isActive: true,
  },
];

export const useWalletCards = () => {
  const [walletCards, setWalletCards] = useState<WalletCard[]>(mockWalletCards);
  const [selectedCard, setSelectedCard] = useState<WalletCard | null>(null);

  const toggleCardActive = (cardId: string) => {
    setWalletCards((prev) =>
      prev.map((card) =>
        card.id === cardId ? { ...card, isActive: !card.isActive } : card
      )
    );
  };

  const addCard = (card: Omit<WalletCard, "id">) => {
    const newCard: WalletCard = {
      ...card,
      id: Date.now().toString(),
    };
    setWalletCards((prev) => [newCard, ...prev]);
  };

  const removeCard = (cardId: string) => {
    setWalletCards((prev) => prev.filter((card) => card.id !== cardId));
  };

  const updateCard = (cardId: string, updates: Partial<WalletCard>) => {
    setWalletCards((prev) =>
      prev.map((card) => (card.id === cardId ? { ...card, ...updates } : card))
    );
  };

  const getActiveCards = () => {
    return walletCards.filter((card) => card.isActive);
  };

  const getCardById = (cardId: string) => {
    return walletCards.find((card) => card.id === cardId);
  };

  const getTotalBalance = () => {
    return walletCards
      .filter((card) => card.isActive)
      .reduce((total, card) => {
        const balance = parseFloat(card.balance.replace(/,/g, ""));
        return total + balance;
      }, 0);
  };

  return {
    walletCards,
    selectedCard,
    setSelectedCard,
    toggleCardActive,
    addCard,
    removeCard,
    updateCard,
    getActiveCards,
    getCardById,
    getTotalBalance,
  };
};
