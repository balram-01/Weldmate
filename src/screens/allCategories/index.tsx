import React from "react";
import { SafeAreaView, Alert, View, TouchableOpacity,Text } from "react-native";
import Categories from "../../component/category";

import Ionicons from "react-native-vector-icons/Ionicons";
import { productImages } from "../../images";

const categoriesData = [
  {
    id: "1",
    title: "Welding",
    color: "#D8F3DC",
    items: [
      {
        id: "1a",
        name: "Saw Welding",
        image:productImages.product1,
      },
      {
        id: "1b",
        name: "Engine Driven Welding",
        image: productImages.product2,
      },
      {
        id: "1c",
        name: "MIG Welder",
        image: productImages.product1,
      },
    ],
  },
  {
    id: "2",
    title: "Cutting",
    color: "#FDE2E4",
    items: [
      {
        id: "2a",
        name: "Cutting Torches",
        image:productImages.cutter1,
      },
      {
        id: "2b",
        name: "Plasma Cutter",
        image:productImages.cutter2,
      },
      {
        id: "2c",
        name: "Flash Back Arrestors",
        image: productImages.cutter1,
      },
    ],
  },
];

const AllCategories = () => {
  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Categories</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity>
            <Ionicons name="search" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: 15 }}>
            <Ionicons name="camera-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories List */}
      <Categories
        categories={categoriesData}
        onExpand={(category) => Alert.alert(category.title)}
      />
    </View>
  );
};

const styles = {
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
};

export default AllCategories;