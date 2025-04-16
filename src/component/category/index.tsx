import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Animated, { FadeInUp, FadeInRight, useSharedValue, withSpring, useAnimatedStyle } from "react-native-reanimated";
import LinearGradient from "react-native-linear-gradient";

interface CategoryItemType {
  id: string;
  name: string;
  image: { uri: string } | string;
}

interface Category {
  id: string;
  title: string;
  color: string;
  items: CategoryItemType[];
}

interface CategoriesProps {
  categories: Category[];
  onExpand: (category: Category) => void;
}

interface SubcategoryItemProps {
  subItem: CategoryItemType;
}

interface CategoryItemProps {
  item: Category;
  index: number;
  onExpand: (category: Category) => void;
}

const SubcategoryItem: React.FC<SubcategoryItemProps> = ({ subItem }) => {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const imageSource = typeof subItem.image === "string" ? { uri: subItem.image } : subItem.image;

  return (
    <Animated.View entering={FadeInRight} style={[styles.itemContainer, animatedStyle]}>
      <TouchableOpacity
        onPress={() => console.log("Tapped subcategory:", subItem.name)}
        onPressIn={() => (scale.value = withSpring(0.98))}
        onPressOut={() => (scale.value = withSpring(1))}
      >
        <View style={styles.subcategoryCard}>
          <Image
            source={imageSource}
            style={styles.itemImage}
            // defaultSource={require("../../../images/placeholder.png")}
            resizeMode="cover"
          />
          <Text style={styles.itemText} numberOfLines={2}>
            {subItem.name}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const CategoryItem: React.FC<CategoryItemProps> = ({ item, index, onExpand }) => {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const colors = [
    ["#00838F", "#00ACC1"], // Teal-Blue
    ["#6A1B9A", "#AB47BC"], // Purple-Indigo
    ["#0D47A1", "#1976D2"], // Deep Blue-Navy
    ["#D32F2F", "#F44336"], // Red-Crimson
    ["#2E7D32", "#4CAF50"], // Green-Emerald
    ["#C2185B", "#EC407A"], // Pink-Magenta
    ["#455A64", "#78909C"], // Gray-Slate
    ["#7B1FA2", "#BA68C8"], // Deep Purple
    ["#00796B", "#26A69A"], // Teal-Green
    ["#3949AB", "#5C6BC0"], // Indigo-Blue
  ];
  
  
  const headerGradient = colors[index % colors.length];

  return (
    <Animated.View entering={FadeInUp} style={[styles.categoryWrapper, animatedStyle]}>
      <TouchableOpacity
        onPress={() => onExpand(item)}
        onPressIn={() => (scale.value = withSpring(0.98))}
        onPressOut={() => (scale.value = withSpring(1))}
      >
        <LinearGradient colors={headerGradient} style={styles.header}>
          <Text style={styles.categoryTitle}>{item.title}</Text>
          <Ionicons name="chevron-forward" size={20} color="#FFF" />
        </LinearGradient>
      </TouchableOpacity>
      <View style={styles.categoryContainer}>
        {item.items.length > 0 ? (
          <FlatList
            data={item.items}
            horizontal
            keyExtractor={(subItem) => subItem.id}
            renderItem={({ item: subItem }) => <SubcategoryItem subItem={subItem} />}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.subcategoryList}
          />
        ) : (
          <Text style={styles.emptyText}>No subcategories available</Text>
        )}
      </View>
    </Animated.View>
  );
};

const Categories: React.FC<CategoriesProps> = ({ categories, onExpand }) => {
  console.log("Categories Rendering:", { categories });

  return (
    <FlatList
      data={categories}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
        <CategoryItem item={item} index={index} onExpand={onExpand} />
      )}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
      ListEmptyComponent={<Text style={styles.emptyText}>No categories available</Text>}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
    backgroundColor: "#F7F7F7",
  },
  categoryWrapper: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  categoryTitle: {
    fontSize: 18,
    fontFamily: "Roboto-Bold",
    color: "#FFF",
  },
  categoryContainer: {
    padding: 12,
    backgroundColor: "#FFF",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    minHeight: 100,
  },
  subcategoryList: {
    paddingHorizontal: 4,
  },
  itemContainer: {
    marginRight: 12,
  },
  subcategoryCard: {
    alignItems: "center",
    backgroundColor: "#F7F7F7",
    borderRadius: 10,
    padding: 8,
    width: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemText: {
    fontSize: 14,
    fontFamily: "Roboto-Regular",
    color: "#1A2526",
    marginTop: 8,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Roboto-Regular",
    color: "#1A2526",
    textAlign: "center",
    padding: 16,
  },
});

export default Categories;