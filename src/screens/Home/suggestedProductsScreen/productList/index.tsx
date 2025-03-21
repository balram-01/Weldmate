import React from "react";
import { View, Image, Text, FlatList, StyleSheet } from "react-native";

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
}

interface ProductListProps {
  title: string;
  products: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ title, products }) => {
  return (
    <View style={styles.container}>
      {/* Section Title */}
      <Text style={styles.sectionTitle}>{title}</Text>

      <FlatList
        data={products}
        numColumns={2}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={styles.columnWrapper}
        initialNumToRender={6}
        renderItem={({ item }) => (
          <View style={styles.productContainer}>
            {/* Image Container with Light Background */}
            <View style={styles.imageContainer}>
              <Image source={item.image } style={styles.productImage} />
            </View>
            {/* Product Name and Price - Outside Image Container */}
            <Text style={styles.productName} numberOfLines={2}>
              {item.name}
            </Text>
            <Text style={styles.productPrice}>{item.price}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "left",
    color: "#000",
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  productContainer: {
    flex: 1,
    alignItems: "center",
    marginBottom: 15,
  },
  imageContainer: {
    backgroundColor: "#F5F5F5", // Light grey background
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    width: 150, // Fixed width to match the layout
    height: 120, // Fixed height to contain image
  },
  productImage: {
    width: 120,
    height: 100,
    resizeMode: "contain",
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    color: "#333",
    marginTop: 8, // Space between image container and text
  },
  productPrice: {
    fontSize: 13,
    color: "#555",
    fontWeight: "500",
    marginTop: 4,
  },
});

export default ProductList;