import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Animated, { FadeIn } from "react-native-reanimated";
import ScreenNames from "../../utils/screenNames";
import { getToken } from "../../utils/authStorage";
import { getUserInfo, storeUserData } from "../../utils/storage/userStorage";
import { useLazyGetUserDetailsQuery } from "../../redux/api/user";
import { useDispatch } from "react-redux";
import { setLoading, setUser, setError } from "../../redux/slices/user";
import { app_logo } from "../../images";


// Define the expected user details response type
interface UserDetails {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  phone: string;
  role: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const SplashScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch(); // Add Redux dispatch
  const [userId, setUserId] = useState<number | null>(null);
  console.log("userId from splash screen", userId);

  // Use the lazy query hook
  const [triggerGetUserDetails, { data: userDetails, error: userDetailsError, isLoading: isUserDetailsLoading }] =
    useLazyGetUserDetailsQuery();
  console.log("Userdetails error", userDetailsError);

  // Check login status and set userId
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await getToken();
        const storedUserInfo = await getUserInfo();

        if (!token) {
          console.log("No token, redirecting to Register");
          setTimeout(() => navigation.replace(ScreenNames.LOGIN), 2000);
          return;
        }

        if (!storedUserInfo || !storedUserInfo.id) {
          console.log("No user info or ID, redirecting to Login");
          setTimeout(() => navigation.replace(ScreenNames.LOGIN), 2000);
          return;
        }

        console.log("Setting userId:", storedUserInfo.id);
        setUserId(storedUserInfo.id);
      } catch (error) {
        console.error("Error checking login status:", error);
        setTimeout(() => navigation.replace(ScreenNames.LOGIN), 2000);
      }
    };

    checkLoginStatus();
  }, [navigation]);

  // Trigger the API call when userId changes
  useEffect(() => {
    if (userId) {
      console.log("Triggering user details fetch for userId:", userId);
      dispatch(setLoading(true)); // Set loading state in Redux
      triggerGetUserDetails(userId);
    }
  }, [userId, triggerGetUserDetails, dispatch]);

  // Handle API response and navigation
  useEffect(() => {
    if (userId) {
      if (isUserDetailsLoading) {
        console.log("Fetching user details...");
      } else if (userDetails) {
        console.log("User details fetched:", userDetails);
        // Store in AsyncStorage and Redux
        storeUserData(userDetails)
          .then(() => {
            console.log("Updated user details stored in AsyncStorage:", userDetails);
            dispatch(setUser(userDetails)); // Store in Redux
            setTimeout(() => navigation.replace(ScreenNames.HOME), 2000);
          })
          .catch((error) => {
            console.error("Error storing user data:", error);
            dispatch(setError("Failed to store user data")); // Set error in Redux
            setTimeout(() => navigation.replace(ScreenNames.HOME), 2000); // Proceed anyway
          });
      } else if (userDetailsError) {
        console.error("Error fetching user details:", userDetailsError);
        dispatch(setError(userDetailsError.message || "Failed to fetch user details")); // Set error in Redux
        setTimeout(() => navigation.replace(ScreenNames.HOME), 2000); // Proceed if token exists
      }
    }
  }, [userId, userDetails, userDetailsError, isUserDetailsLoading, navigation, dispatch]);

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn.duration(1000)}>
        <Image source={app_logo} style={styles.logo} />
      </Animated.View>
      {/* <Animated.Text style={styles.title} entering={FadeIn.delay(500).duration(1000)}>
        WeldMate
      </Animated.Text> */}
      <Animated.Text style={styles.subtitle} entering={FadeIn.delay(1000).duration(1000)}>
        Your One-Stop Welding Marketplace
      </Animated.Text>
      <ActivityIndicator size="large" color="#FFD700" style={styles.loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 240,
    height: 240,
    resizeMode: "contain",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFD700",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#E0E0E0",
    marginTop: -45,
  },
  loader: {
    marginTop: 20,
  },
});

export default SplashScreen;