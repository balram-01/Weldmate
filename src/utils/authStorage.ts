import AsyncStorage from "@react-native-async-storage/async-storage";

// Store token
export const storeToken = async (token: string) => {
  try {
    await AsyncStorage.setItem("userToken", token);
  } catch (error) {
    console.error("Error storing token:", error);
  }
};

// Retrieve token
export const getToken = async () => {
  try {
    return await AsyncStorage.getItem("userToken");
  } catch (error) {
    console.error("Error retrieving token:", error);
    return null;
  }
};

// Remove token
export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem("userToken");
  } catch (error) {
    console.error("Error removing token:", error);
  }
};