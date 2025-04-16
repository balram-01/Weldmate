import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { productImages } from "../../../../images";


const recommendedProducts = [
  {
    id: "1",
    name: "Plasma cutting torch 125H 10Mtr",
    price: "₹10,000.00",
    image: productImages.cutter1,
  },
  {
    id: "2",
    name: "ESAB Welding leather gloves short",
    price: "₹150.00 – ₹250.00",
    image: productImages.cutter2,
  },
  {
    id: "3",
    name: "VR Coating service kit for air motor 125 part no. 01",
    price: "₹70.00 – ₹91.00",
    image: productImages.product1,
  },
  {
    id: "4",
    name: "CNC Portable 2.0X6MTR (Single Drive)",
    price: "₹185,000.00",
    image: productImages.product2,
  },
];

const RecommendedProducts = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>You Might Like These</Text>
        <TouchableOpacity>
          <Ionicons name="chevron-forward" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <Text style={styles.subtitle}>Customised picks just for you</Text>

      {/* Product List */}
      <FlatList
        data={recommendedProducts}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Image source={item.image} style={styles.productImage} />
            <Text style={styles.price}>{item.price}</Text>
            <Text style={styles.productName}>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subtitle: {
    color: "gray",
    marginBottom: 10,
  },
  productCard: {
    backgroundColor: "#FEEBEC",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    marginRight: 15,
    width: 150,
  },
  productImage: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
  },
  productName: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 5,
  },
});

export default RecommendedProducts;