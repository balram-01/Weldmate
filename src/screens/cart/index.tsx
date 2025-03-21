import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons"; // For back button
import { productImages } from "../../images";

interface CartItem {
  id: string;
  name: string;
  priceRange: string;
  image: string;
  selected: boolean;
}

const CartScreen = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "MEW Chopper 150",
      priceRange: "₹250,000.00 – ₹350,000.00",
      image: productImages.cutter1, // Replace with actual image URL
      selected: false,
    },
    {
      id: "2",
      name: "Medium-Size Cutting Machines PNC-10 Elite / PNC 12 Extreme",
      priceRange: "₹480,000.00 – ₹750,000.00",
      image:productImages.cutter2, // Replace with actual image URL
      selected: false,
    },
  ]);

  const toggleSelectItem = (id: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const selectAllItems = () => {
    const allSelected = cartItems.every((item) => item.selected);
    setCartItems((prev) => prev.map((item) => ({ ...item, selected: !allSelected })));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={styles.headerTitle}>Shopping Cart</Text>
      </View>

      {/* Cart Summary */}
      <Text style={styles.cartSummary}>
        Your cart <Text style={styles.itemCount}>{cartItems.length} Items</Text>
      </Text>

      {/* Select All Option */}
      <TouchableOpacity onPress={selectAllItems}>
        <Text style={styles.selectAll}>Select all items</Text>
      </TouchableOpacity>

      {/* Cart Items List */}
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            {/* Checkbox */}
            <TouchableOpacity onPress={() => toggleSelectItem(item.id)}>
              <View style={styles.checkbox}>
                {item.selected && <View style={styles.checked} />}
              </View>
            </TouchableOpacity>

            {/* Product Image */}
            <View style={styles.imageContainer}>
              <Image source={ item.image } style={styles.productImage} />
            </View>

            {/* Product Details */}
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>{item.priceRange}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  cartSummary: {
    fontSize: 18,
    fontWeight: "500",
  },
  itemCount: {
    color: "red",
    fontWeight: "bold",
  },
  selectAll: {
    color: "#0099FF",
    fontSize: 16,
    marginVertical: 10,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#999",
    borderRadius: 3,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  checked: {
    width: 14,
    height: 14,
    backgroundColor: "blue",
  },
  imageContainer: {
    backgroundColor: "#E8F5E9", // Light green background
    padding: 10,
    borderRadius: 6,
  },
  productImage: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  productDetails: {
    marginLeft: 10,
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  productPrice: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
});

export default CartScreen;