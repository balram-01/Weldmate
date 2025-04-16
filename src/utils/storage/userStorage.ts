import AsyncStorage from "@react-native-async-storage/async-storage";


const USER_INFO_KEY = "userInfo";

// Save user token and info
export const storeUserData = async ( user: any) => {
  try {

    await AsyncStorage.setItem(USER_INFO_KEY, JSON.stringify(user));
    console.log("User data saved successfully");
  } catch (error) {
    console.error("Error saving user data:", error);
  }
};


// Get user info
export const getUserInfo = async (): Promise<any | null> => {
  try {
    const userInfo = await AsyncStorage.getItem(USER_INFO_KEY);
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error("Error retrieving user info:", error);
    return null;
  }
};

// Remove user token and info (Logout function)
export const clearUserData = async () => {
  try {
    await AsyncStorage.removeItem(USER_INFO_KEY);
    console.log("User data cleared successfully");
  } catch (error) {
    console.error("Error clearing user data:", error);
  }
};
