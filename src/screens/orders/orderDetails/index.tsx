import React from 'react';
import { View, FlatList, Image, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { Text, Button, Card, Searchbar, Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Define custom themes for light and dark modes
const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#007AFF',
    background: '#F5F5F5',
    surface: '#FFFFFF',
    text: '#000000',
    placeholder: '#888888',
    accent: '#FFD700', // For stars
  },
};

const darkTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#40C4FF',
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    placeholder: '#B0B0B0',
    accent: '#FFD700', // For stars
  },
};

// Sample data for the orders
const orders = [
  {
    id: '1',
    productName: 'Lincoln Electric Activ8X® Wire Feeder (TWECO)',
    deliveryDate: 'Delivered on Feb 24',
    rating: 3,
    image: 'https://via.placeholder.com/100',
    action: 'Write Review',
  },
  {
    id: '2',
    productName: 'Cable Connector Female 10-25',
    deliveryDate: 'Delivered on Jan 10',
    rating: 5,
    image: 'https://via.placeholder.com/100',
    action: 'Rate the product now',
  },
  {
    id: '3',
    productName: 'Lincoln Electric Invertec® 220TPX',
    deliveryDate: 'Delivered on Jan 10',
    rating: 0,
    image: 'https://via.placeholder.com/100',
    action: 'Rate the product now',
  },
];

const OrderDetailsScreen = () => {
  // Detect the color scheme (light or dark)
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  // Function to render star ratings
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Icon
          key={i}
          name={i <= rating ? 'star' : 'star-border'}
          size={20}
          color={i <= rating ? theme.colors.accent : theme.colors.placeholder}
        />
      );
    }
    return stars;
  };

  // Render each order item
  const renderOrderItem = ({ item }) => (
    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.orderContainer}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <View style={styles.orderDetails}>
          <Text style={[styles.deliveryDate, { color: theme.colors.placeholder }]}>
            {item.deliveryDate}
          </Text>
          <Text style={[styles.productName, { color: theme.colors.text }]}>
            {item.productName}
          </Text>
          <View style={styles.ratingContainer}>{renderStars(item.rating)}</View>
          <TouchableOpacity>
            <Text style={[styles.actionText, { color: theme.colors.primary }]}>
              {item.action}
            </Text>
          </TouchableOpacity>
        </View>
        <Icon name="chevron-right" size={24} color={theme.colors.text} />
      </View>
    </Card>
  );

  return (
    <PaperProvider theme={theme}>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
          <TouchableOpacity>
            <Icon name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>MY ORDERS</Text>
          <TouchableOpacity>
            <Icon name="shopping-cart" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <Searchbar
          placeholder="Search Your Product Here"
          style={[styles.searchBar, { backgroundColor: theme.colors.surface }]}
          inputStyle={[styles.searchInput, { color: theme.colors.text }]}
          placeholderTextColor={theme.colors.placeholder}
          iconColor={theme.colors.placeholder}
        />

        {/* Order List */}
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchBar: {
    margin: 16,
    borderRadius: 8,
    elevation: 2,
  },
  searchInput: {
    fontSize: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
  },
  orderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  orderDetails: {
    flex: 1,
  },
  deliveryDate: {
    fontSize: 14,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  actionText: {
    fontSize: 14,
    marginTop: 4,
  },
});

export default OrderDetailsScreen;