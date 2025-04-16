import React, { memo, useCallback, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import HomeScreen from "../../../screens/Home";
import CartScreen from "../../../screens/cart";
import ScreenNames from "../../../utils/screenNames";
import FavouritesScreen from "../../../screens/favourite";
import AllCategories from "../../../screens/allCategories";
import { selectCartItems } from "../../../redux/slices/cart/cartSlice";
import { selectWishlistItems } from "../../../redux/slices/wishlist/wishlistSlice";
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
} from "react-native-reanimated";
import LinearGradient from "react-native-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RootState } from "../../../redux/store";
import { useGetCartCountQuery } from "../../../redux/api/product";


const Tab = createBottomTabNavigator();

// Memoized Tab Icon Component
const TabIcon = memo(
  ({ routeName, color, focused, cartCount, wishlistCount }: any) => {
    const scale = useSharedValue(1);
    const badgeScale = useSharedValue(
      (routeName === ScreenNames.CART_SCREEN && cartCount > 0) ||
        (routeName === ScreenNames.FAVOURITES_SCREEN && wishlistCount > 0)
        ? 1
        : 0
    );

    const animatedIconStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const animatedBadgeStyle = useAnimatedStyle(() => ({
      transform: [{ scale: badgeScale.value }],
      opacity: badgeScale.value,
    }));

    let iconName = "";
    let label = "";
    if (routeName === "Home") {
      iconName = focused ? "home" : "home-outline";
      label = "Home";
    } else if (routeName === "Categories") {
      iconName = focused ? "grid" : "grid-outline";
      label = "Categories";
    } else if (routeName === ScreenNames.FAVOURITES_SCREEN) {
      iconName = focused ? "heart" : "heart-outline";
      label = "Favourites";
    } else if (routeName === ScreenNames.CART_SCREEN) {
      iconName = focused ? "cart" : "cart-outline";
      label = "Cart";
    }

    // Animate badge when cartCount or wishlistCount changes
    React.useEffect(() => {
      badgeScale.value = withSpring(
        (routeName === ScreenNames.CART_SCREEN && cartCount > 0) ||
          (routeName === ScreenNames.FAVOURITES_SCREEN && wishlistCount > 0)
          ? 1
          : 0,
        { damping: 15 }
      );
    }, [cartCount, wishlistCount, badgeScale, routeName]);

    return (
      <View style={styles.tabContainer}>
        <Animated.View
          style={[styles.iconWrapper, animatedIconStyle]}
          onPressIn={() => (scale.value = withSpring(0.98, { damping: 20 }))}
          onPressOut={() => (scale.value = withSpring(1, { damping: 20 }))}
        >
          <Icon
            name={iconName}
            size={focused ? 26 : 24}
            color={color}
            style={styles.tabIcon}
          />
          {(routeName === ScreenNames.CART_SCREEN && cartCount > 0) ||
          (routeName === ScreenNames.FAVOURITES_SCREEN && wishlistCount > 0) ? (
            <Animated.View style={[styles.badge, animatedBadgeStyle]}>
              <LinearGradient
                colors={["#FFD814", "#FF6D00"]}
                style={styles.badgeGradient}
              >
                <Text style={styles.badgeText}>
                  {routeName === ScreenNames.CART_SCREEN
                    ? cartCount > 99
                      ? "99+"
                      : cartCount
                    : wishlistCount > 99
                    ? "99+"
                    : wishlistCount}
                </Text>
              </LinearGradient>
            </Animated.View>
          ) : null}
        </Animated.View>
        {focused && (
          <LinearGradient
            colors={["#FFD814", "#FF6D00"]}
            style={styles.activeIndicator}
          />
        )}
      </View>
    );
  }
);

const BottomNavigator = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const cartItems = useSelector(selectCartItems);
  const wishlistItems = useSelector(selectWishlistItems);
  const { data: cartCountData } = useGetCartCountQuery(user?.id, {
    skip: !user?.id,
  });
  const cartCount = cartCountData?.cart_count
    ? parseInt(cartCountData.cart_count)
    : cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlistItems.length;
  const insets = useSafeAreaInsets();
  const tabBarStyle = useCallback(
    () => ({
      backgroundColor: "#FFF",
      borderTopWidth: 0,
      height: 64 + insets.bottom,
      paddingBottom: insets.bottom,
      paddingTop: 8,
      paddingHorizontal: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
    }),
    [insets.bottom]
  );

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, focused }) => (
          <TabIcon
            routeName={route.name}
            color={color}
            focused={focused}
            cartCount={cartCount}
            wishlistCount={wishlistCount}
          />
        ),
        tabBarActiveTintColor: "#FF6D00",
        tabBarInactiveTintColor: "#666",
        tabBarStyle: tabBarStyle(),
        tabBarShowLabel: false,
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Categories"
        component={AllCategories}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name={ScreenNames.FAVOURITES_SCREEN}
        component={FavouritesScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name={ScreenNames.CART_SCREEN}
        component={CartScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    maxWidth: 80,
  },
  iconWrapper: {
    position: "relative",
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  tabIcon: {
    // No margins to prevent overflow
  },
  activeIndicator: {
    width: 24,
    height: 3,
    borderRadius: 1.5,
    position: "absolute",
    bottom: -6,
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    padding: 2,
  },
  badgeText: {
    fontSize: 10,
    color: "#FFF",
    fontFamily: "Roboto-Bold",
    textAlign: "center",
    lineHeight: 12,
  },
});

export default BottomNavigator;