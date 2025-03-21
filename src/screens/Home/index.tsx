import React from "react";
import {
  View,
  ScrollView,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Header from "./header";
import BannerCarousel from "./bannerCarousal";
import ShopByCategory from "./shop/category";
import ShopByBestSellers from "./shop/bestSeller";
import ShopByBrands from "./shop/brands";
import SuggestedProductsScreen from "./suggestedProductsScreen";

const HomeScreen = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header />
      <ScrollView>
        <LocationSelector />
        <BannerCarousel />
        <ShopByCategory />
        <ShopByBestSellers />
        <ShopByBrands />
        <SuggestedProductsScreen/>
      </ScrollView>
    </View>
  );
};

const LocationSelector = () => (
  <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
    <Ionicons
      name="location-outline"
      size={20}
      color="black"
      style={{ marginRight: 5 }}
    />
    <Text>Deliver to selected location</Text>
  </View>
);

export default HomeScreen;
