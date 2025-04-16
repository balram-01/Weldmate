import React from "react";
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Categories from "../../component/category";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useGetAllCategoriesWithSubcategoriesQuery } from "../../redux/api/product";
import Animated, { FadeInUp } from "react-native-reanimated";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import ScreenNames from "../../utils/screenNames";

const getCategoryColor = (index: number) => {
  const colors = [
    { solid: "#FFD814", gradient: ["#FFD814", "#FF6D00"] },
    { solid: "#FF6D00", gradient: ["#FF6D00", "#FFD814"] },
    { solid: "#1A2526", gradient: ["#1A2526", "#2A3B3C"] },
    { solid: "#F7F7F7", gradient: ["#F7F7F7", "#FFF"] },
  ];
  return colors[index % colors.length];
};

const AllCategories = () => {
  const navigation = useNavigation();
  const { data, error, isLoading, refetch } = useGetAllCategoriesWithSubcategoriesQuery();

  console.log("RTK Query:", { isLoading, error, data, categoriesLength: data?.data?.length });

  const categoriesData = data?.success && data?.data?.length
    ? data.data.map((category, index) => ({
        id: category.id.toString(),
        title: category.name || "Unnamed Category",
        color: getCategoryColor(index).solid,
        items: category.subcategories?.map((sub) => ({
          id: sub.id.toString(),
          name: sub.name || "Unnamed Subcategory",
          image: { uri: sub.image_url || "" },
        })) || [],
      }))
    : [
        {
          id: "fallback-1",
          title: "Sample Category",
          color: getCategoryColor(0).solid,
          items: [
            { id: "sub-1", name: "Sample Subcategory", image: { uri: "" } },
          ],
        },
      ];

  console.log("Categories Data:", categoriesData);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient colors={["#FFD814", "#FF6D00"]} style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          accessibilityLabel="Go back"
        >
          <View style={styles.headerIcon}>
            <Ionicons name="arrow-back" size={24} color="#FF6D00" />
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Categories</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate(ScreenNames.SEARCH_SCREEN)}
          accessibilityLabel="Search categories"
        >
          <View style={styles.headerIcon}>
            <Ionicons name="search" size={24} color="#FF6D00" />
          </View>
        </TouchableOpacity>
      </LinearGradient>

      {/* Content */}
      <Animated.View entering={FadeInUp} style={styles.content}>
        {isLoading ? (
          <View style={styles.stateContainer}>
            <ActivityIndicator size="large" color="#FF6D00" />
            <Text style={styles.stateText}>Loading Categories...</Text>
          </View>
        ) : error ? (
          <View style={styles.stateContainer}>
            <Ionicons name="alert-circle-outline" size={32} color="#FF6D00" />
            <Text style={styles.stateText}>
              Error: {error?.message || "Unknown Error"}
            </Text>
            <TouchableOpacity onPress={refetch}>
              <LinearGradient colors={["#FFD814", "#FF6D00"]} style={styles.retryButton}>
                <Text style={styles.retryText}>Retry</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : categoriesData.length === 0 ? (
          <View style={styles.stateContainer}>
            <Text style={styles.stateText}>No Categories Available</Text>
          </View>
        ) : (
          <Categories
            categories={categoriesData}
            onExpand={(category) => navigation.navigate("SubcategoryScreen", { categoryId: category.id })}
          />
        )}
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Roboto-Bold",
    color: "#FFF",
  },
  headerIcon: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  content: {
    flex: 1,
    marginHorizontal: 16,
    marginVertical: 12,
  },
  stateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  stateText: {
    fontSize: 16,
    fontFamily: "Roboto-Regular",
    color: "#1A2526",
    marginTop: 8,
    textAlign: "center",
  },
  retryButton: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 12,
  },
  retryText: {
    fontSize: 14,
    fontFamily: "Roboto-Bold",
    color: "#FFF",
  },
});

export default AllCategories;