import { useEffect, useState } from "react";
import { Alert, Platform } from "react-native";
import NfcManager, { NfcTech } from "react-native-nfc-manager";

export interface NFCCard {
  id: string;
  type: string;
  data?: string;
  timestamp: number;
}

export const useNFC = () => {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scannedCards, setScannedCards] = useState<NFCCard[]>([]);

  useEffect(() => {
    checkNFCSupport();
    return () => {
      NfcManager.cancelTechnologyRequest();
    };
  }, []);

  const checkNFCSupport = async () => {
    try {
      const supported = await NfcManager.isSupported();
      setIsSupported(supported);

      if (supported) {
        await NfcManager.start();
        const enabled = await NfcManager.isEnabled();
        setIsEnabled(enabled);
      }
    } catch (error) {
      console.error("Error checking NFC support:", error);
      setIsSupported(false);
    }
  };

  const requestNFCPermission = async () => {
    if (Platform.OS === "ios") {
      try {
        await NfcManager.requestTechnology(NfcTech.Ndef);
        setIsEnabled(true);
        return true;
      } catch (error) {
        console.error("NFC permission denied:", error);
        Alert.alert(
          "NFC Permission",
          "Please enable NFC in Settings to use this feature."
        );
        return false;
      }
    }
    return true;
  };

  const startScan = async () => {
    if (!isSupported) {
      Alert.alert("NFC Not Supported", "Your device does not support NFC.");
      return;
    }

    if (!isEnabled) {
      const hasPermission = await requestNFCPermission();
      if (!hasPermission) return;
    }

    setIsScanning(true);

    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);

      const tag = await NfcManager.getTag();

      if (tag) {
        const cardData: NFCCard = {
          id: tag.id || "unknown",
          type: "NDEF",
          data: tag.ndefMessage ? JSON.stringify(tag.ndefMessage) : undefined,
          timestamp: Date.now(),
        };

        setScannedCards((prev) => [cardData, ...prev]);
        Alert.alert("NFC Card Detected", `Card ID: ${cardData.id}`);
      }
    } catch (error) {
      console.error("Error scanning NFC:", error);
      Alert.alert("Scan Error", "Failed to read NFC card. Please try again.");
    } finally {
      setIsScanning(false);
      NfcManager.cancelTechnologyRequest();
    }
  };

  const stopScan = () => {
    setIsScanning(false);
    NfcManager.cancelTechnologyRequest();
  };

  const clearScannedCards = () => {
    setScannedCards([]);
  };

  const writeToNFC = async (data: string) => {
    if (!isSupported || !isEnabled) {
      Alert.alert(
        "NFC Not Available",
        "NFC is not supported or enabled on this device."
      );
      return;
    }

    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);

      // For now, we'll just show a success message
      // Writing to NFC requires more complex implementation
      Alert.alert("Success", "NFC card detected for writing!");
    } catch (error) {
      console.error("Error writing to NFC:", error);
      Alert.alert("Write Error", "Failed to write data to NFC card.");
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  };

  return {
    isSupported,
    isEnabled,
    isScanning,
    scannedCards,
    startScan,
    stopScan,
    clearScannedCards,
    writeToNFC,
    checkNFCSupport,
  };
};
