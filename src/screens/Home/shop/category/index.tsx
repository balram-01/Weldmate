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
import { useGetProductCategoriesQuery } from "../../../../redux/api/product";

// Define the Category interface based on the JSON
interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
  image: string;
  created_at: string;
  updated_at: string;
  status: number;
  deleted_at: string | null;
  image_url: string;
}

// Define the CategoriesResponse interface (optional, for clarity)
interface CategoriesResponse {
  success: boolean;
  data: Category[];
  message?: string;
}

const CategoryCard = ({ id, name, image_url }: { id: number; name: string; image_url: string }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        // Navigate to a category screen, passing the category ID
        navigation.navigate(ScreenNames.ALL_CATEGORIES, { categoryId: id });
      }}
    >
      <Image
        source={{ uri: image_url }}
        style={styles.image}
        // defaultSource={require("../../../../images/placeholder.png")} // Optional: placeholder image
      />
      <Text style={styles.text}>{name}</Text>
    </TouchableOpacity>
  );
};

const ShopByCategory = () => {
  const navigation = useNavigation();
  const { data, isLoading, isError } = useGetProductCategoriesQuery(undefined);

  // Extract categories from the API response
  const categories: Category[] = data?.success && data?.data ? data.data : [];

  if (isLoading) {
    return <Text>Loading categories...</Text>;
  }

  if (isError || !categories.length) {
    return <Text>No categories available.</Text>;
  }

  return (
    <View style={{ marginBottom: 10 }}>
      {/* Title Section (OUTSIDE GREEN BOX) */}
      <View style={styles.header}>
        <Text style={styles.title}>Shop By Category</Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(ScreenNames.ALL_CATEGORIES);
          }}
        >
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      {/* Green Container with Categories */}
      <View style={styles.container}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()} // Use toString() for type safety
          renderItem={({ item }) => <CategoryCard id={item.id} name={item.name} image_url={item.image_url} />}
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
    textAlign: "center",
  },
});

export default ShopByCategory;