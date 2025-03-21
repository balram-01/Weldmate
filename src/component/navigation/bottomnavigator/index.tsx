import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { View, Text } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import HomeScreen from "../../../screens/Home";
import CartScreen from "../../../screens/cart";
import ScreenNames from "../../../utils/screenNames";
import FavouritesScreen from "../../../screens/favourite";
import AllCategories from "../../../screens/allCategories";

// Dummy Screens




const Tab = createBottomTabNavigator();

const BottomNavigator = () => {
  return (
    <Tab.Navigator
    
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: string = "";
          if (route.name === "Home") iconName = "home-outline";
          else if (route.name === "Categories") iconName = "grid-outline";
          else if (route.name === ScreenNames.FAVOURITES_SCREEN) iconName = "heart-outline";
          else if (route.name === ScreenNames.CART_SCREEN) iconName = "cart-outline";

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#E95D3C",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { height: 60 },
      })}
    >
      <Tab.Screen name="Home" options={{headerShown:false}} component={HomeScreen} />
      <Tab.Screen name="Categories" options={{headerShown:false}}  component={AllCategories} />
      <Tab.Screen name={ScreenNames.FAVOURITES_SCREEN} options={{headerShown:false}}  component={FavouritesScreen} />
      <Tab.Screen name={ScreenNames.CART_SCREEN} options={{headerShown:false}}  component={CartScreen} />
      
    </Tab.Navigator>
  );
};

export default BottomNavigator;
