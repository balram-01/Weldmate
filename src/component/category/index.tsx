import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

interface CategoryItem {
  id: string;
  name: string;
  image: string;
}

interface Category {
  id: string;
  title: string;
  color: string;
  items: CategoryItem[];
}

interface CategoriesProps {
  categories: Category[];
  onExpand: (category: Category) => void;
}


const Categories: React.FC<CategoriesProps> = ({ categories, onExpand }) => {
    return (
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.categoryWrapper}>
            {/* Title & Expand Button (Outside Colored Box) */}
            <View style={styles.header}>
              <Text style={styles.categoryTitle}>{item.title}</Text>
              <TouchableOpacity onPress={() => onExpand(item)}>
                <Ionicons name="chevron-forward" size={20} color="black" />
              </TouchableOpacity>
            </View>
  
            {/* Colored Container for Category Items */}
            <View style={[styles.categoryContainer, { backgroundColor: item.color }]}>
              <FlatList
                data={item.items}
                horizontal
                keyExtractor={(subItem) => subItem.id}
                renderItem={({ item: subItem }) => (
                  <View style={styles.itemContainer}>
                    <Image source={subItem.image } style={styles.itemImage} />
                    <Text style={styles.itemText}>{subItem.name}</Text>
                  </View>
                )}
                showsHorizontalScrollIndicator={false}
              />
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
      />
    );
  };
  
  // Styles
  const styles = StyleSheet.create({
    listContainer: {
      padding: 10,
    },
    categoryWrapper: {
      marginBottom: 15,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 10,
      marginBottom: 5, // Space between header and colored box
    },
    categoryTitle: {
      fontSize: 18,
      fontWeight: "bold",
    },
    categoryContainer: {
      borderRadius: 10,
      padding: 15,
    },
    itemContainer: {
      alignItems: "center",
      marginRight: 15,
    },
    itemImage: {
      width: 60,
      height: 60,
      borderRadius: 10,
    },
    itemText: {
      fontSize: 12,
      marginTop: 5,
      textAlign: "center",
    },
  });
  
  export default Categories;