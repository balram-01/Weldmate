import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, TextInput, Checkbox, Button } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import ScreenNames from "../../../utils/screenNames";

const WelcomeBackScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigation =useNavigation()
  return (
    <View style={styles.container}>
      {/* Welcome Back Title */}
      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.subtitle}>Use your credentials below login to your account</Text>

      {/* Email Input */}
      <Text style={styles.label}>Email</Text>
      <TextInput
        placeholder="Email here"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
        outlineColor="#E5E5E5"
        activeOutlineColor="#E5E5E5"
      />

      {/* Password Input */}
      <Text  style={styles.label}>Password</Text>
      <TextInput
        placeholder="Password here"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        style={styles.input}
        outlineColor="#E5E5E5"
        activeOutlineColor="#E5E5E5"
        secureTextEntry={!showPassword}
        right={
          <TextInput.Icon
            icon={showPassword ? "eye-off-outline" : "eye-outline"}
            color={"#999"}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      />

      {/* Remember Me & Forgot Password */}
      <View style={styles.row}>
        <Checkbox.Android
          status={rememberMe ? "checked" : "unchecked"}
          onPress={() => setRememberMe(!rememberMe)}
          color="#2BA24C"
          uncheckedColor="#E5E5E5"
        />
        <Text style={styles.rememberMe}>Remember me</Text>
        <TouchableOpacity onPress={(()=>navigation.navigate(ScreenNames.FORGOT_PASSWORD))}>
          <Text style={styles.forgotPassword}>Forgot password?</Text>
        </TouchableOpacity>
      </View>

      {/* Sign In Button */}
      <Button mode="contained" style={styles.signInButton}>
        Sign in
      </Button>

      {/* Sign Up Text */}
      <Text onPress={(()=>navigation.navigate(ScreenNames.REGISTER))} style={styles.signUpText}>
        Don’t have an account? <Text style={styles.signUp}>Sign Up</Text>
      </Text>

      {/* OR Divider */}
      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.divider} />
      </View>

      {/* Apple Sign In Button */}
      <TouchableOpacity style={styles.socialButton}>
        <FontAwesome name="apple" size={20} color="black" />
        <Text style={styles.socialText}>Continue With Apple</Text>
      </TouchableOpacity>

      {/* Google Sign In Button */}
      <TouchableOpacity style={styles.socialButton}>
        <FontAwesome name="google" size={20} color="#db4437" />
        <Text style={styles.socialText}>Continue With Google</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: "white",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FF5733",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#B5B5B5",
    textAlign: "center",
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    marginBottom: 5,
  },
  input: {
    marginBottom: 15,
    backgroundColor: "#FAFAFA",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
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
  signInButton: {
    backgroundColor: "#FF5733",
    borderRadius: 8,
    paddingVertical: 6,
    fontSize: 16,
  },
  signUpText: {
    textAlign: "center",
    fontSize: 14,
    marginVertical: 15,
  },
  signUp: {
    color: "#FF5733",
    fontWeight: "bold",
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
  },
  socialText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
  },
});

export default WelcomeBackScreen;