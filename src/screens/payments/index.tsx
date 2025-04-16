import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, TextInput, Modal, ActivityIndicator, Dimensions } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Dropdown } from "react-native-element-dropdown";
import { useAddBankDetailsMutation, useGetBankDetailsByUserIdQuery, useUpdateBankDetailsMutation } from "../../redux/api/user";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Snackbar } from 'react-native-paper';

const { width } = Dimensions.get('window');

const PaymentDetailsScreen = () => {
  const { user: { id: userId } } = useSelector((state: RootState) => state.user);

  // API Hooks
  const { data, isLoading, isError, error, refetch } = useGetBankDetailsByUserIdQuery(userId);
  const [updateBankDetails, { isLoading: isUpdatingBank, isError: isUpdateError, error: updateError }] = useUpdateBankDetailsMutation();
  const [addBankDetails, { isLoading: isAddingBank, isError: isAddError, error: addError,data:addBankDetailsData }] = useAddBankDetailsMutation();
console.log('addBankDetailsData',addBankDetailsData);
console.log('addBankDetailserror',addError)
  // State
  const [bankDetails, setBankDetails] = useState({ cards: [], banks: [], upis: [] });
  const [isModalVisible, setModalVisible] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateType, setUpdateType] = useState("");
  const [updateId, setUpdateId] = useState(null);
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    type: "",
    card_holder_name: "",
    card_number: "",
    card_expiry_date: "",
    card_cvv: "",
    account_holder: "",
    bank_name: "",
    account_number: "",
    ifsc_code: "",
    upi_id: "",
    id: ''
  });
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarError, setSnackbarError] = useState(false);

  const paymentTypes = [
    { label: "Card", value: "card" },
    { label: "Bank", value: "bank" },
    { label: "UPI", value: "upi" },
  ];

  // useEffect and validation functions remain unchanged
  useEffect(() => {
    if (data) {
      const cards = [];
      const banks = [];
      const upis = [];
      
      (Array.isArray(data.data) ? data.data : [data.data]).forEach((item) => {
        if (item.card_number) {
          cards.push({
            id: item.id,
            card_holder_name: item.card_holder_name || "N/A",
            card_number: item.card_number || "N/A",
            card_expiry_date: item.card_expiry_date || "N/A",
            card_cvv_no: item.card_cvv_no || "N/A",
          });
        } else if (item.account_number || item.bank_name || item.account_holder || item.ifsc_code) {
          banks.push({
            id: item.id,
            account_holder: item.account_holder || "N/A",
            bank_name: item.bank_name || "N/A",
            account_number: item.account_number || "N/A",
            ifsc_code: item.ifsc_code || "N/A",
          });
        } else if (item.upi_id) {
          upis.push({
            id: item.id,
            upi_id: item.upi_id || "N/A",
          });
        }
      });

      setBankDetails({ cards, banks, upis });
    }
  }, [data]);

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 16);
    return cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
  };

  const formatExpiryDate = (text) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length > 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    }
    return cleaned;
  };

  const validateCVV = (text) => {
    return text.replace(/\D/g, '').slice(0, 3);
  };

  const validateAccountNumber = (text) => {
    return text.replace(/\D/g, '');
  };

  const handleUpdateClick = (type, id) => {
    setIsUpdating(true);
    setUpdateType(type);
    setUpdateId(id);
    setModalVisible(true);

    if (type === "card") {
      const card = bankDetails.cards.find(c => c.id === id);
      setNewPaymentMethod({
        ...newPaymentMethod,
        type: "card",
        card_holder_name: card.card_holder_name,
        card_number: card.card_number,
        card_expiry_date: card.card_expiry_date,
        card_cvv: card.card_cvv_no,
      });
    } else if (type === "bank") {
      const bank = bankDetails.banks.find(b => b.id === id);
      setNewPaymentMethod({
        ...newPaymentMethod,
        type: "bank",
        account_holder: bank.account_holder,
        bank_name: bank.bank_name,
        account_number: bank.account_number,
        ifsc_code: bank.ifsc_code,
      });
    } else if (type === "upi") {
      const upi = bankDetails.upis.find(u => u.id === id);
      setNewPaymentMethod({
        ...newPaymentMethod,
        type: "upi",
        upi_id: upi.upi_id,
      });
    }
  };

  const handleAddPaymentMethod = async () => {
    try {
      const errors = [];
      if (newPaymentMethod.type === "card") {
        if (!newPaymentMethod.card_holder_name.trim()) errors.push("Card holder name is required.");
        if (!newPaymentMethod.card_number.trim()) errors.push("Card number is required.");
        else if (newPaymentMethod.card_number.replace(/\s/g, "").length !== 16) errors.push("Card number must be 16 digits.");
        if (!newPaymentMethod.card_expiry_date.trim()) errors.push("Expiry date is required.");
        else if (!/^\d{2}\/\d{2}$/.test(newPaymentMethod.card_expiry_date)) errors.push("Expiry date must be in MM/YY format.");
        if (!newPaymentMethod.card_cvv.trim()) errors.push("CVV is required.");
        else if (newPaymentMethod.card_cvv.length !== 3) errors.push("CVV must be 3 digits.");
      } else if (newPaymentMethod.type === "bank") {
        if (!newPaymentMethod.account_holder.trim()) errors.push("Account holder name is required.");
        if (!newPaymentMethod.bank_name.trim()) errors.push("Bank name is required.");
        if (!newPaymentMethod.account_number.trim()) errors.push("Account number is required.");
        if (!newPaymentMethod.ifsc_code.trim()) errors.push("IFSC code is required.");
      } else if (newPaymentMethod.type === "upi") {
        if (!newPaymentMethod.upi_id.trim()) errors.push("UPI ID is required.");
      } else {
        errors.push("Please select a payment type.");
      }

      if (errors.length > 0) {
        setSnackbarMessage(`Error: ${errors.join(" ")}`);
        setSnackbarError(true);
        setSnackbarVisible(true);
        return;
      }

      let payload = { status: 1, user_id: userId };
      if (newPaymentMethod.type === "card") {
        payload = {
          ...payload,
          card_name: "VISA",
          card_number: newPaymentMethod.card_number.replace(/\s/g, ""),
          card_cvv_no: newPaymentMethod.card_cvv,
          card_expiry_date: newPaymentMethod.card_expiry_date,
          card_holder_name: newPaymentMethod.card_holder_name,
        };
      } else if (newPaymentMethod.type === "bank") {
        payload = {
          ...payload,
          account_holder: newPaymentMethod.account_holder,
          bank_name: newPaymentMethod.bank_name,
          account_number: newPaymentMethod.account_number,
          ifsc_code: newPaymentMethod.ifsc_code,
        };
      } else if (newPaymentMethod.type === "upi") {
        payload = {
          ...payload,
          upi_id: newPaymentMethod.upi_id,
        };
      }

      let response;
      if (isUpdating) {
        console.log("updating payment details with payload",{ userId, data: { ...payload, id: updateId } })
        response = await updateBankDetails({ userId, data: { ...payload, id: updateId } }).unwrap();
      } else {
        console.log('addBankDetailsPayload',payload)
        response = await addBankDetails(payload).unwrap();
      }

      if (response.error || !response.success) {
        throw new Error(response.message || "Operation failed");
      }

      setSnackbarMessage(isUpdating ? "Payment method updated successfully" : "Payment method added successfully");
      setSnackbarError(false);
      setSnackbarVisible(true);
      refetch();
      resetModal();
    } catch (err) {
      const errorMessage = err.data?.message || err.message || "Operation failed";
      setSnackbarMessage(`Error: ${errorMessage}`);
      setSnackbarError(true);
      setSnackbarVisible(true);
      console.error("Error in handleAddPaymentMethod:", err);
    }
  };

  const resetModal = () => {
    setModalVisible(false);
    setIsUpdating(false);
    setUpdateType("");
    setUpdateId(null);
    setNewPaymentMethod({
      type: "",
      card_holder_name: "",
      card_number: "",
      card_expiry_date: "",
      card_cvv: "",
      account_holder: "",
      bank_name: "",
      account_number: "",
      ifsc_code: "",
      upi_id: "",
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading payment details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.containerWrapper}>
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="card-outline" size={20} color="#000" style={styles.icon} />
              <Text style={styles.sectionTitle}>Card Details</Text>
            </View>
          </View>
          {bankDetails.cards.map((card) => (
            <View key={card.id} style={styles.paymentItem}>
              <View style={styles.paymentInfo}>
                <Text style={styles.label}>Card Holder</Text>
                <Text style={styles.value}>{card.card_holder_name}</Text>
                <Text style={styles.label}>Card Number</Text>
                <Text style={styles.value}>{card.card_number}</Text>
                <Text style={styles.label}>Expiry</Text>
                <Text style={styles.value}>{card.card_expiry_date}</Text>
                <Text style={styles.label}>CVV</Text>
                <Text style={styles.value}>{card.card_cvv_no}</Text>
              </View>
              <TouchableOpacity 
                style={styles.updateButton}
                onPress={() => handleUpdateClick("card", card.id)}
              >
                <Text style={styles.actionText}>UPDATE</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="business-outline" size={20} color="#000" style={styles.icon} />
              <Text style={styles.sectionTitle}>Bank Details</Text>
            </View>
          </View>
          {bankDetails.banks.map((bank) => (
            <View key={bank.id} style={styles.paymentItem}>
              <View style={styles.paymentInfo}>
                <Text style={styles.label}>Account Holder</Text>
                <Text style={styles.value}>{bank.account_holder}</Text>
                <Text style={styles.label}>Bank Name</Text>
                <Text style={styles.value}>{bank.bank_name}</Text>
                <Text style={styles.label}>Account Number</Text>
                <Text style={styles.value}>{bank.account_number}</Text>
                <Text style={styles.label}>IFSC Code</Text>
                <Text style={styles.value}>{bank.ifsc_code}</Text>
              </View>
              <TouchableOpacity 
                style={styles.updateButton}
                onPress={() => handleUpdateClick("bank", bank.id)}
              >
                <Text style={styles.actionText}>UPDATE</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Image source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/7/7d/UPI-Logo.png" }} style={styles.upiIcon} />
              <Text style={styles.sectionTitle}>UPI Details</Text>
            </View>
          </View>
          {bankDetails.upis.map((upi) => (
            <View key={upi.id} style={styles.paymentItem}>
              <View style={styles.paymentInfo}>
                <Text style={styles.label}>UPI ID</Text>
                <Text style={styles.value}>{upi.upi_id}</Text>
              </View>
              <TouchableOpacity 
                style={styles.updateButton}
                onPress={() => handleUpdateClick("upi", upi.id)}
              >
                <Text style={styles.actionText}>UPDATE</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => {
            setIsUpdating(false);
            setModalVisible(true);
          }}
        >
          <Text style={styles.addButtonText}>+ Add Payment Method</Text>
        </TouchableOpacity>

        <Modal visible={isModalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <ScrollView contentContainerStyle={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>
                  {isUpdating ? "Update Payment Method" : "Add New Payment Method"}
                </Text>

                {!isUpdating && (
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Payment Type</Text>
                    <Dropdown
                      style={styles.dropdown}
                      data={paymentTypes}
                      labelField="label"
                      valueField="value"
                      placeholder="Select Payment Type"
                      value={newPaymentMethod.type}
                      onChange={(item) => setNewPaymentMethod({ ...newPaymentMethod, type: item.value })}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      itemTextStyle={styles.itemTextStyle}
                    />
                  </View>
                )}

                {newPaymentMethod.type === "card" && (
                  <>
                    <View style={styles.inputContainer}>
                      <Text style={styles.label}>Card Holder Name</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter card holder name"
                        value={newPaymentMethod.card_holder_name}
                        onChangeText={(text) => setNewPaymentMethod({ ...newPaymentMethod, card_holder_name: text })}
                      />
                    </View>
                    <View style={styles.inputContainer}>
                      <Text style={styles.label}>Card Number</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="1234 5678 9012 3456"
                        value={newPaymentMethod.card_number}
                        onChangeText={(text) => setNewPaymentMethod({ 
                          ...newPaymentMethod, 
                          card_number: formatCardNumber(text) 
                        })}
                        keyboardType="numeric"
                        maxLength={19}
                      />
                    </View>
                    <View style={styles.inputContainer}>
                      <Text style={styles.label}>Expiry Date (MM/YY)</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="MM/YY"
                        value={newPaymentMethod.card_expiry_date}
                        onChangeText={(text) => setNewPaymentMethod({ 
                          ...newPaymentMethod, 
                          card_expiry_date: formatExpiryDate(text) 
                        })}
                        keyboardType="numeric"
                        maxLength={5}
                      />
                    </View>
                    <View style={styles.inputContainer}>
                      <Text style={styles.label}>CVV</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="123"
                        value={newPaymentMethod.card_cvv}
                        onChangeText={(text) => setNewPaymentMethod({ 
                          ...newPaymentMethod, 
                          card_cvv: validateCVV(text) 
                        })}
                        keyboardType="numeric"
                        maxLength={3}
                        secureTextEntry={true}
                      />
                    </View>
                  </>
                )}

                {newPaymentMethod.type === "bank" && (
                  <>
                    <View style={styles.inputContainer}>
                      <Text style={styles.label}>Account Holder</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter account holder name"
                        value={newPaymentMethod.account_holder}
                        onChangeText={(text) => setNewPaymentMethod({ ...newPaymentMethod, account_holder: text })}
                      />
                    </View>
                    <View style={styles.inputContainer}>
                      <Text style={styles.label}>Bank Name</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter bank name"
                        value={newPaymentMethod.bank_name}
                        onChangeText={(text) => setNewPaymentMethod({ ...newPaymentMethod, bank_name: text })}
                      />
                    </View>
                    <View style={styles.inputContainer}>
                      <Text style={styles.label}>Account Number</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter account number"
                        value={newPaymentMethod.account_number}
                        onChangeText={(text) => setNewPaymentMethod({ 
                          ...newPaymentMethod, 
                          account_number: validateAccountNumber(text) 
                        })}
                        keyboardType="numeric"
                      />
                    </View>
                    <View style={styles.inputContainer}>
                      <Text style={styles.label}>IFSC Code</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter IFSC code"
                        value={newPaymentMethod.ifsc_code}
                        onChangeText={(text) => setNewPaymentMethod({ 
                          ...newPaymentMethod, 
                          ifsc_code: text.toUpperCase() 
                        })}
                        maxLength={11}
                      />
                    </View>
                  </>
                )}

                {newPaymentMethod.type === "upi" && (
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>UPI ID</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="username@bank"
                      value={newPaymentMethod.upi_id}
                      onChangeText={(text) => setNewPaymentMethod({ ...newPaymentMethod, upi_id: text })}
                    />
                  </View>
                )}

                <View style={styles.modalButtons}>
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.saveButton, (isAddingBank || isUpdatingBank) && styles.disabledButton]} 
                    onPress={handleAddPaymentMethod}
                    disabled={isAddingBank || isUpdatingBank}
                  >
                    {isAddingBank || isUpdatingBank ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.modalButtonText}>Save</Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.cancelButton]} 
                    onPress={resetModal}
                  >
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </Modal>
      </ScrollView>
      
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={[styles.snackbar, snackbarError ? styles.errorSnackbar : styles.successSnackbar]}
      >
        <Text style={styles.snackbarText}>{snackbarMessage}</Text>
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  containerWrapper: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  section: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  icon: {
    marginRight: 8,
  },
  upiIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  paymentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
  },
  paymentInfo: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
    fontWeight: "bold",
  },
  updateButton: {
    padding: 8,
  },
  actionText: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "600",
  },
  addButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
  },
  modalContainer: {
    padding: 20,
    minHeight: '50%',
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: width * 0.9,
    maxWidth: 400,
    alignSelf: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: '#000',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    height: 50,
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#999",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#333",
  },
  itemTextStyle: {
    fontSize: 16,
    color: "#333",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    padding: 12,
    borderRadius: 5,
    width: '48%',
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#007AFF",
  },
  cancelButton: {
    backgroundColor: "#6c757d",
  },
  disabledButton: {
    backgroundColor: "#999",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  snackbar: {
    margin: 16,
    borderRadius: 4,
  },
  successSnackbar: {
    backgroundColor: '#28a745',
  },
  errorSnackbar: {
    backgroundColor: '#dc3545',
  },
  snackbarText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default PaymentDetailsScreen;