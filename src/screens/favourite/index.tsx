import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons"; // Icons for back & heart
import { productImages } from "../../images";

interface FavouriteItem {
  id: string;
  name: string;
  priceRange: string;
  image: string;
}

const FavouritesScreen = () => {
  const [favourites, setFavourites] = useState<FavouriteItem[]>([
    {
      id: "1",
      name: "MEW Chopper 150",
      priceRange: "₹250,000.00 – ₹350,000.00",
      image:productImages.product1, // Replace with actual image URL
    },
    {
      id: "2",
      name: "Medium-Size Cutting Machines PNC-10 Elite / PNC 12 Extreme",
      priceRange: "₹480,000.00 – ₹750,000.00",
      image: productImages.product2,  // Replace with actual image URL
    },
  ]);

  const removeFavourite = (id: string) => {
    setFavourites((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={styles.headerTitle}>Favourites</Text>
      </View>

      {/* Favourite Items List */}
      <FlatList
        data={favourites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.favouriteItem}>
            {/* Product Image */}
            <View style={styles.imageContainer}>
              <Image source={item.image} style={styles.productImage} />
            </View>

            {/* Product Details */}
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>{item.priceRange}</Text>
            </View>

            {/* Remove from Favourites */}
            <TouchableOpacity onPress={() => removeFavourite(item.id)}>
              <Ionicons name="heart" size={24} color="red" />
            </TouchableOpacity>
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
  favouriteItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    padding: 10,
    borderRadius: 6,
    backgroundColor: "#F5F5F5", // Light gray background
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

export default FavouritesScreen;