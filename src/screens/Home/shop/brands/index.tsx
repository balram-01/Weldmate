import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { productImages } from "../../../../images";

const brands = [
  {
    id: "1",
    name: "Brand1",
    image: productImages.product1,
  },
  {
    id: "2",
    name: "Brand2",
    image:  productImages.product2,
  },
  {
    id: "3",
    name: "Brand3",
    image:  productImages.product1,
  },
  {
    id: "4",
    name: "Brand4",
    image: productImages.product2,
  },
];

const BrandCard = ({ name, image }) => (
  <View style={styles.card}>
    <Image source={image} style={styles.image} />
    <Text style={styles.text}>{name}</Text>
  </View>
);

const ShopByBrands = () => {
  return (
    <View style={{ marginBottom: 10 }}>
      {/* Title Section (OUTSIDE GREEN BOX) */}
      <View style={styles.header}>
        <Text style={styles.title}>Shop By Brands</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      {/* Green Container with Brands */}
      <View style={styles.container}>
        <FlatList
          data={brands}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <BrandCard {...item} />}
          contentContainerStyle={styles.list}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  viewAll: {
    fontSize: 14,
    color: "gray",
  },
  container: {
    backgroundColor: "#EAF9E1",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  list: {
    paddingHorizontal: 5,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    marginRight: 10,
    width: 100,
  },
  image: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
  text: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default ShopByBrands;