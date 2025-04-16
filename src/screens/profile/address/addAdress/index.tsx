import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Appbar, Text, TextInput, Button, Checkbox } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AddAddressScreen = ({ navigation, route }) => {
  const { address: initialAddress } = route.params || {};
  const [fullName, setFullName] = useState(initialAddress?.name || '');
  const [phoneNumber, setPhoneNumber] = useState(initialAddress?.phone || '');
  const [alternatePhone, setAlternatePhone] = useState(initialAddress?.alternatePhone || '');
  const [pincode, setPincode] = useState(initialAddress?.pincode || '');
  const [state, setState] = useState(initialAddress?.state || '');
  const [city, setCity] = useState(initialAddress?.city || '');
  const [flat, setFlat] = useState(initialAddress?.flat || '');
  const [area, setArea] = useState(initialAddress?.area || '');
  const [landmark, setLandmark] = useState(initialAddress?.landmark || '');
  const [addressType, setAddressType] = useState(initialAddress?.type || 'Home');
  const [isBillTo, setIsBillTo] = useState(initialAddress?.isBillTo || false);

  useEffect(() => {
    navigation.setOptions({ 
      title: initialAddress ? 'Edit Delivery Address' : 'Add Delivery Address' 
    });
  }, [initialAddress, navigation]);

  const handleSaveAddress = () => {
    if (!fullName || !phoneNumber || !pincode || !state || !city) {
      alert('Please fill all required fields.');
      return;
    }

    const addressData = {
      name: fullName,
      phone: phoneNumber,
      alternatePhone,
      pincode,
      state,
      city,
      flat,
      area,
      landmark,
      type: addressType,
      isBillTo,
    };

    alert(`Address ${initialAddress ? 'updated' : 'added'} successfully: ${JSON.stringify(addressData)}`);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Appbar */}
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={initialAddress ? 'Edit Address' : 'Add Address'} />
        <Appbar.Action icon="cart" onPress={() => {}} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.formContainer}>
        {/* Full Name */}
        <TextInput
          label="Full Name (Required)*"
          value={fullName}
          onChangeText={setFullName}
          style={styles.input}
          mode="outlined"
        />

        {/* Phone Number */}
        <TextInput
          label="Phone number (Required)*"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          style={styles.input}
          mode="outlined"
        />
        <Text style={styles.linkText} onPress={() => {}}>
          + Add Alternate Phone Number
        </Text>

        {/* Pincode with Use Location Button */}
        <View style={styles.row}>
          <TextInput
            label="Pincode (Required)*"
            value={pincode}
            onChangeText={setPincode}
            keyboardType="numeric"
            style={[styles.input, styles.pincodeInput]}
            mode="outlined"
          />
          <Button
            mode="contained"
            onPress={() => {}}
            style={styles.locationButton}
            labelStyle={styles.locationButtonText}
          >
            Use my location
          </Button>
        </View>

        {/* State */}
        <TextInput
          label="State (Required)*"
          value={state}
          onChangeText={setState}
          style={styles.input}
          mode="outlined"
          right={<TextInput.Icon name="arrow-drop-down" />}
        />

        {/* City */}
        <TextInput
          label="City (Required)*"
          value={city}
          onChangeText={setCity}
          style={styles.input}
          mode="outlined"
          right={<TextInput.Icon name="arrow-drop-down" />}
        />

        {/* Flat / House No. */}
        <TextInput
          label="Flat, House no., Building, Company, Apartment"
          value={flat}
          onChangeText={setFlat}
          style={styles.input}
          mode="outlined"
        />

        {/* Area / Street */}
        <TextInput
          label="Area, Street, Sector, Village"
          value={area}
          onChangeText={setArea}
          style={styles.input}
          mode="outlined"
        />

        {/* Landmark */}
        <TextInput
          label="Landmark"
          value={landmark}
          onChangeText={setLandmark}
          style={styles.input}
          mode="outlined"
        />

        {/* Address Type */}
        <Text style={styles.sectionTitle}>Type of address</Text>
        <View style={styles.addressTypeContainer}>
          <Button
            mode={addressType === 'Home' ? 'contained' : 'outlined'}
            onPress={() => setAddressType('Home')}
            style={styles.typeButton}
            labelStyle={styles.typeButtonText}
          >
            <Icon name="home" size={16} color={addressType === 'Home' ? '#fff' : '#000'} /> Home
          </Button>
          <Button
            mode={addressType === 'Work' ? 'contained' : 'outlined'}
            onPress={() => setAddressType('Work')}
            style={styles.typeButton}
            labelStyle={styles.typeButtonText}
          >
            <Icon name="work" size={16} color={addressType === 'Work' ? '#fff' : '#000'} /> Work
          </Button>
        </View>

        {/* Billing Address Checkbox */}
        <View style={styles.checkboxContainer}>
          <Checkbox
            status={isBillTo ? 'checked' : 'unchecked'}
            onPress={() => setIsBillTo(!isBillTo)}
            color="#FF5722"
          />
          <Text style={styles.checkboxLabel}>Make this my bill to address</Text>
        </View>

        {/* Save Button */}
        <Button
          mode="contained"
          onPress={handleSaveAddress}
          style={styles.saveButton}
          labelStyle={styles.saveButtonText}
          color="#FF5722"
        >
          Add address
        </Button>
      </ScrollView>
    </View>
  );
};

export default AddAddressScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formContainer: {
    padding: 16,
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  pincodeInput: {
    flex: 1,
    marginRight: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationButton: {
    backgroundColor: '#3F51B5',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  locationButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  linkText: {
    color: '#3F51B5',
    marginBottom: 12,
    textDecorationLine: 'underline',
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  addressTypeContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    marginRight: 8,
    borderRadius: 4,
  },
  typeButtonText: {
    textTransform: 'none',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 14,
  },
  saveButton: {
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 16,
  },
  saveButtonText: {
    textTransform: 'none',
    fontSize: 16,
  },
});