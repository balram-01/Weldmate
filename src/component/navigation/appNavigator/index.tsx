import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import ForgotPasswordScreen from "../../../screens/auth/forgotPassword";
import LoginScreen from "../../../screens/auth/login";
import ResetPasswordScreen from "../../../screens/auth/resetPassword";
import BottomNavigator from "../bottomnavigator";
import ScreenNames from "../../../utils/screenNames";
import RegisterScreen from "../../../screens/auth/register";
import WelcomeBackScreen from "../../../screens/auth/welcomeBack";
import EmailVerificationScreen from "../../../screens/auth/emailVerification";
import AllCategories from "../../../screens/allCategories";
import ProductReview from "../../../screens/productReview";
import SearchScreen from "../../../screens/searchScreen";
import SplashScreen from "../../../screens/splash";
import ProfileScreen from "../../../screens/profile";
import EditProfileScreen from "../../../screens/profile/editProfile";
import PaymentDetailsScreen from "../../../screens/payments";
import OrderDetailsScreen from "../../../screens/orders/orderDetails";
import { SafeAreaView } from "react-native";
import AddressScreen from "../../../screens/profile/address/addressdetails";
import AddAddressScreen from "../../../screens/profile/address/addAdress";
import ProductDetails from "../../../screens/product/productDetails";

const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={ScreenNames.SPLASH_SCREEN}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen
          name={ScreenNames.SPLASH_SCREEN}
          component={SplashScreen}
        />
        {/* Authentication Screens */}
        <Stack.Screen
          name={ScreenNames.WELCOME_BACK}
          component={WelcomeBackScreen}
        />
        <Stack.Screen name={ScreenNames.LOGIN} component={LoginScreen} />
        <Stack.Screen name={ScreenNames.REGISTER} component={RegisterScreen} />

        <Stack.Screen
          name={ScreenNames.FORGOT_PASSWORD}
          component={ForgotPasswordScreen}
        />
        <Stack.Screen
          name={ScreenNames.EMAIL_VERIFICATION}
          component={EmailVerificationScreen}
        />
        <Stack.Screen
          name={ScreenNames.RESET_PASSWORD}
          component={ResetPasswordScreen}
        />
        <Stack.Screen
          name={ScreenNames.ALL_CATEGORIES}
          component={AllCategories}
        />
        <Stack.Screen
          name={ScreenNames.PRODUCT_REVIEW}
          component={ProductReview}
        />
        <Stack.Screen
          name={ScreenNames.SEARCH_SCREEN}
          component={SearchScreen}
        />
        <Stack.Screen
          name={ScreenNames.PROFILE_SCREEN}
          options={{ headerShown: false }}
          component={ProfileScreen}
        />
        <Stack.Screen
          name={ScreenNames.EDIT_PROFILE}
          component={EditProfileScreen}
        />
        <Stack.Screen
          name={ScreenNames.PAYMENT_DETAILS}
          component={PaymentDetailsScreen}
        />
        <Stack.Screen
          name={ScreenNames.ORDER_DETAILS}
          component={OrderDetailsScreen}
        />
          <Stack.Screen
          name={ScreenNames.ADD_PAYMENT_DETAILS}
          component={PaymentDetailsScreen}
        />
           <Stack.Screen
          name={ScreenNames.ADDRESS_DETAILS_SCREEN}
          component={AddressScreen}
        />
          <Stack.Screen
          name={ScreenNames.ADD_ADDRESS_DETAILS}
          component={AddAddressScreen}
        />
          <Stack.Screen
          name={ScreenNames.PRODUCT_DETAILS}
          component={ProductDetails}
        />
        {/* Main App Navigation */}
        <Stack.Screen name={ScreenNames.HOME} component={BottomNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
