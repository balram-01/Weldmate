import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Animated, {
  FadeInUp,
  FadeInDown,
  useSharedValue,
  withSpring,
  useAnimatedStyle,
} from "react-native-reanimated";
import LinearGradient from "react-native-linear-gradient";
import Header from "./header";
import BannerCarousel from "./bannerCarousal";
import ShopByCategory from "./shop/category";
import SuggestedProductsScreen from "./suggestedProductsScreen";
import RecommendedProducts from "./suggestedProductsScreen/mightLike";
import { productImages } from "../../images";
import { getUserInfo } from "../../utils/storage/userStorage";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const [userLocation, setUserLocation] = useState("Select Location");
  const bannerData = [
    { id: 1, image: productImages.banner_welding_machine },
    { id: 2, image: productImages.banner_welding_machine2 },
    { id: 3, image: productImages.banner_welding_machine },
  ];
  const shopProductBanner = [
    { id: 1, image: productImages.shop_now_banner },
    { id: 2, image: productImages.shop_now_banner },
    { id: 3, image: productImages.shop_now_banner },
  ];

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const user = await getUserInfo();
        if (user?.location) {
          setUserLocation(user.location);
        }
      } catch (error) {
        console.log("Error fetching user info:", error);
      }
    };
    fetchUserInfo();
  }, []);

  return (
    <View style={[styles.container,]}>
      <Header />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <LocationSelector userLocation={userLocation} />
        <BannerCarousel
          bannerData={bannerData}
          width={width - 32}
          style={styles.section}
        />
        <ShopByCategory style={styles.section} />
        <SuggestedProductsScreen style={styles.section} />
        <RecommendedProducts style={styles.section} />
        <Animated.View entering={FadeInDown} style={styles.shopBannerContainer}>
          <BannerCarousel
            bannerData={shopProductBanner}
            width={width - 64}
            style={styles.shopBanner}
          />
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const LocationSelector = ({ userLocation }: { userLocation: string }) => {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View entering={FadeInUp} style={styles.section}>
      <TouchableOpacity
     
        onPress={() => {
          // Placeholder: Navigate to location picker
          console.log("Open location picker");
        }}
        onPressIn={() => (scale.value = withSpring(0.98))}
        onPressOut={() => (scale.value = withSpring(1))}
      >
        <LinearGradient
          colors={["#FFF", "#F7F7F7"]}
          style={styles.locationContainer}
        >
          <Ionicons
            name="location-outline"
            size={22}
            color="#FF6D00"
            style={styles.locationIcon}
          />
          <Text style={styles.locationText}>
            Deliver to: {userLocation}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Placeholder styles for external components (to be merged with actual components)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  section: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 16,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
   
  },
  locationIcon: {
    marginRight: 8,
  },
  locationText: {
    fontSize: 14,
    fontFamily: "Roboto-Regular",
    color: "#1A2526",
    flex: 1,
  },
  shopBannerContainer: {
    alignItems: "center",
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  shopBanner: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
});

export default HomeScreen;