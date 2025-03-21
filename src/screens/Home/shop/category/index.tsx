import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import ScreenNames from "../../../../utils/screenNames";
import { productImages } from "../../../../images";

const categories = [
  {
    id: "1",
    name: "Welding",
    image:productImages.product1,
  },
  {
    id: "2",
    name: "Cutting",
    image:productImages.product2,
  },
  {
    id: "3",
    name: "Painting",
    image: productImages.product1,
  },
  {
    id: "4",
    name: "Automation",
    image: productImages.product2,
  },
];

const CategoryCard = ({ name, image }) => (
  <View style={styles.card}>
    <Image source={image} style={styles.image} />
    <Text style={styles.text}>{name}</Text>
  </View>
);

const ShopByCategory = () => 
  {
    const navigation =useNavigation();
    
  return (
    <View style={{ marginBottom: 10 }}>
      {/* Title Section (OUTSIDE GREEN BOX) */}
      <View style={styles.header}>
        <Text style={styles.title}>Shop By Category</Text>
        <TouchableOpacity onPress={()=>{navigation.navigate(ScreenNames.ALL_CATEGORIES)}}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      {/* Green Container with Categories */}
      <View style={styles.container}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <CategoryCard {...item} />}
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
    marginBottom: 5, // Space between title and green container
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000", // Black color
  },
  viewAll: {
    fontSize: 14,
    color: "gray", // Greyish color
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

export default ShopByCategory;