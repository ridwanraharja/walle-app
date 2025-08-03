import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Share,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function RequestPaymentScreen() {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [requestTo, setRequestTo] = useState('');

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    if (numericValue === '') return '';
    
    const formattedValue = new Intl.NumberFormat('id-ID').format(parseInt(numericValue));
    return `Rp ${formattedValue}`;
  };

  const handleAmountChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    setAmount(numericValue);
  };

  const generatePaymentLink = () => {
    const baseUrl = 'https://wallet.app/pay';
    const paymentId = Date.now().toString(36);
    return `${baseUrl}?id=${paymentId}&amount=${amount}&desc=${encodeURIComponent(description)}`;
  };

  const handleCreateRequest = async () => {
    if (!amount || !requestTo) {
      Alert.alert('Error', 'Harap isi nominal dan nama pembayar');
      return;
    }

    const numericAmount = parseInt(amount);
    if (numericAmount < 1000) {
      Alert.alert('Error', 'Nominal minimum adalah Rp 1.000');
      return;
    }

    try {
      const paymentLink = generatePaymentLink();
      const message = `Hai ${requestTo}!\n\nKamu diminta untuk membayar ${formatCurrency(amount)}\n${description ? `untuk: ${description}\n` : ''}\nKlik link berikut untuk melakukan pembayaran:\n${paymentLink}\n\nTerima kasih!`;

      await Share.share({
        message: message,
        title: 'Request Pembayaran',
      });
    } catch (error) {
      Alert.alert('Error', 'Gagal membuat request pembayaran');
    }
  };

  const handleSaveRequest = () => {
    if (!amount || !requestTo) {
      Alert.alert('Error', 'Harap isi nominal dan nama pembayar');
      return;
    }

    Alert.alert(
      'Request Tersimpan',
      'Request pembayaran telah disimpan. Anda dapat mengirimkannya nanti.',
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
          <Text style={styles.headerTitle}>Request Pembayaran</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          {/* Amount Input */}
          <View style={styles.amountSection}>
            <Text style={styles.amountLabel}>Nominal yang Diminta</Text>
            <View style={styles.amountContainer}>
              <Text style={styles.currencySymbol}>Rp</Text>
              <TextInput
                style={styles.amountInput}
                value={formatCurrency(amount).replace('Rp ', '')}
                onChangeText={handleAmountChange}
                placeholder="0"
                keyboardType="numeric"
                maxLength={15}
              />
            </View>
            <Text style={styles.amountDisplay}>{formatCurrency(amount)}</Text>
          </View>

          {/* Request To */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Dari (Nama Pembayar) *</Text>
            <TextInput
              style={styles.textInput}
              value={requestTo}
              onChangeText={setRequestTo}
              placeholder="Masukkan nama yang akan membayar"
              maxLength={50}
            />
          </View>

          {/* Description */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Deskripsi (Opsional)</Text>
            <TextInput
              style={[styles.textInput, styles.descriptionInput]}
              value={description}
              onChangeText={setDescription}
              placeholder="Untuk apa pembayaran ini..."
              multiline
              numberOfLines={3}
              maxLength={100}
            />
          </View>

          {/* Request Summary */}
          <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>Ringkasan Request</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Nominal:</Text>
              <Text style={styles.summaryValue}>
                {amount ? formatCurrency(amount) : 'Rp 0'}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Dari:</Text>
              <Text style={styles.summaryValue}>
                {requestTo || '-'}
              </Text>
            </View>
            {description && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Untuk:</Text>
                <Text style={styles.summaryValue}>{description}</Text>
              </View>
            )}
          </View>

          {/* Info Section */}
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Ionicons name="information-circle" size={20} color="#007AFF" />
              <Text style={styles.infoText}>
                Request akan dibuat sebagai link yang bisa dibagikan via WhatsApp, SMS, atau media lainnya.
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.saveButton,
              (!amount || !requestTo) && styles.buttonDisabled
            ]}
            onPress={handleSaveRequest}
            disabled={!amount || !requestTo}
          >
            <Text style={styles.saveButtonText}>Simpan Request</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.shareButton,
              (!amount || !requestTo) && styles.buttonDisabled
            ]}
            onPress={handleCreateRequest}
            disabled={!amount || !requestTo}
          >
            <Text style={styles.shareButtonText}>Kirim Request</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  amountSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    marginBottom: 16,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  amountInput: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    minWidth: 100,
  },
  amountDisplay: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  inputSection: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  descriptionInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  summarySection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    flex: 2,
    textAlign: 'right',
  },
  infoSection: {
    backgroundColor: '#f0f7ff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoText: {
    fontSize: 13,
    color: '#007AFF',
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e1e5e9',
    gap: 12,
  },
  saveButton: {
    backgroundColor: '#6c757d',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  shareButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
});