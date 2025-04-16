import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Appbar, Text, Button, Card, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ScreenNames from '../../../../utils/screenNames';

const AddressScreen = ({ navigation }) => {
  const addresses = [
    {
      type: 'Ship To',
      name: 'Matilda Brown',
      address: '25, Green Park Avenue, Near City Mall, Mumbai, Maharashtra - 400001',
      phone: '8547123652',
    },
    {
      type: 'Bill To',
      name: 'Matilda Brown',
      address: '25, Green Park Avenue, Near City Mall, Mumbai, Maharashtra - 400001',
      phone: '8547123652',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Appbar */}
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="My Address" />
        <Appbar.Action icon="cart" onPress={() => {}} />
      </Appbar.Header>

      {/* Add New Address Button */}
      <Button
        mode="contained"
        icon="plus"
        style={styles.addButton}
        onPress={() => navigation.navigate(ScreenNames.ADD_ADDRESS_DETAILS)}
      >
        Add a new address
      </Button>

      {/* Address List */}
      <ScrollView style={styles.addressList}>
        {addresses.map((address, index) => (
          <Card key={index} style={styles.card}>
            <Card.Content>
              <View style={styles.addressHeader}>
                <Text variant="titleMedium">{address.type}</Text>
                <Button mode="outlined" style={styles.homeButton}>
                  HOME
                </Button>
              </View>
              <Text variant="bodyMedium">{address.name}</Text>
              <Text variant="bodyMedium">{address.address}</Text>
              <Text variant="bodyMedium">{address.phone}</Text>
              <View style={styles.actionButtons}>
                <IconButton
                  icon={() => <Icon name="edit" size={20} color="#6200EE" />}
                  onPress={() => navigation.navigate(ScreenNames.ADD_ADDRESS_DETAILS, { address })}
                />
                <IconButton
                  icon={() => <Icon name="delete" size={20} color="#6200EE" />}
                  onPress={() => {
                    // You can add your delete logic here
                    console.log('Delete address:', address);
                  }}
                />
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  addButton: {
    margin: 16,
  },
  addressList: {
    paddingHorizontal: 16,
  },
  card: {
    marginBottom: 16,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  homeButton: {
    borderColor: '#6200EE',
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 8,
  },
});

export default AddressScreen;
