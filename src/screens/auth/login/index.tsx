import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ScreenNames from "../../../utils/screenNames";
import { productImages } from "../../../images";
import { useLoginMutation } from "../../../redux/api/auth";
import { storeToken } from "../../../utils/authStorage";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { Checkbox } from "react-native-paper";
import { storeUserData } from "../../../utils/storage/userStorage";
import { useDispatch } from "react-redux"; // Import useDispatch
import { setUser } from "../../../redux/slices/user";


const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigation = useNavigation();
  const [login, loginResult] = useLoginMutation();
  const [rememberMe, setRememberMe] = useState(false);
  const dispatch = useDispatch(); // Add Redux dispatch

  const validateForm = () => {
    let tempErrors = {};
    if (!email) tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) tempErrors.email = "Email is invalid";
    if (!password) tempErrors.password = "Password is required";
    else if (password.length < 6)
      tempErrors.password = "Password must be at least 6 characters";

    setErrors(tempErrors);
    console.log("Validation errors:", tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleLogin = async () => {
    console.log("Login button pressed");

    if (!validateForm()) {
      console.log("Validation failed");
      return;
    }

    setLoading(true);
    console.log("Attempting login with:", { email, password });

    try {
      const payload = { email, password };

      console.log("Sending API request...");
      const response = await login(payload).unwrap();

      console.log("API Response:", response);

      if (response.success && response.token) {
        console.log("Login successful, storing token...");
        await storeToken(response.token); // Store token in AsyncStorage
        console.log("Token stored successfully");

        console.log("Storing user data...");
        await storeUserData(response.user); // Store user data in AsyncStorage
        dispatch(setUser(response.user)); // Store user data in Redux

        console.log("Navigating to Home...");
        navigation.navigate(ScreenNames.HOME);
      } else {
        Alert.alert("Login Failed", response.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert(
        "Error",
        error.data?.message || "An error occurred while logging in"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={productImages.banner_welding_machine}
        style={styles.image}
      />

      <View style={styles.content}>
        <Text style={styles.logoText}>
          <Text style={styles.logoPrimary}>WELD</Text>
          <Text style={styles.logoSecondary}>MATE</Text>
        </Text>

        <Text style={styles.title}>Log In</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#888"
            autoCapitalize="none"
          />
        </View>
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#888"
          />
        </View>
        {errors.password && (
          <Text style={styles.errorText}>{errors.password}</Text>
        )}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "LOADING..." : "LOGIN"}
          </Text>
        </TouchableOpacity>

        {/* Remember Me & Forgot Password */}
        <View style={styles.row}>
          <Checkbox.Android
            status={rememberMe ? "checked" : "unchecked"}
            onPress={() => setRememberMe(!rememberMe)}
            color="#2BA24C"
            uncheckedColor="#E5E5E5"
          />
          <Text style={styles.rememberMe}>Remember me</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate(ScreenNames.FORGOT_PASSWORD)}
          >
            <Text style={styles.forgotPassword}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Up Text */}
        <Text
          onPress={() => navigation.navigate(ScreenNames.REGISTER)}
          style={styles.signUpText}
        >
          Don’t have an account?{" "}
          <Text style={styles.signUp}>Sign Up</Text>
        </Text>

        {/* OR Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.divider} />
        </View>

        {/* Apple Sign In Button */}
        {/* <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="apple" size={20} color="black" />
          <Text style={styles.socialText}>Continue With Apple</Text>
        </TouchableOpacity> */}

        {/* Google Sign In Button */}
        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="google" size={20} color="#db4437" />
          <Text style={styles.socialText}>Continue With Google</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  image: { width: "100%", height: 200, resizeMode: "cover" },
  content: { alignItems: "center", padding: 20 },
  logoText: { fontSize: 30, fontWeight: "bold" },
  logoPrimary: { color: "#4E948A" },
  logoSecondary: { color: "#F27440" },
  title: { fontSize: 20, color: "#333", marginTop: 10, marginBottom: 20 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    width: "100%",
    paddingHorizontal: 15,
    height: 50,
    backgroundColor: "#F9F9F9",
    marginBottom: 10,
  },
  input: { flex: 1, fontSize: 16, color: "#000" },
  button: {
    backgroundColor: "#4E948A",
    borderRadius: 10,
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: "#cccccc",
  },
  buttonText: { fontSize: 18, color: "#fff", fontWeight: "bold" },
  errorText: {
    color: "#DB4437",
    fontSize: 12,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  signUpText: {
    textAlign: "center",
    fontSize: 14,
    marginVertical: 15,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E5E5",
  },
  orText: {
    marginHorizontal: 10,
    fontSize: 14,
    color: "#B5B5B5",
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: "center",
    marginBottom: 12,
    backgroundColor: "white",
    padding: 20,
  },
  socialText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
  },
  signUp: {
    color: "#FF5733",
    fontWeight: "bold",
  },
  rememberMe: {
    fontSize: 14,
    color: "black",
    flex: 1,
  },
  forgotPassword: {
    fontSize: 14,
    color: "#FF5733",
    textDecorationLine: "underline",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
});

export default LoginScreen;