import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { TextInput, Checkbox } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ScreenNames from "../../../utils/screenNames";
import { useResetPasswordRequestMutation } from "../../../redux/api/user";
import { useRegisterMutation } from "../../../redux/api/auth";
import { storeToken } from "../../../utils/authStorage"; // Import storeToken
import { storeUserData } from "../../../utils/storage/userStorage"; // Import storeUserData
import { useDispatch } from "react-redux"; // Import useDispatch
import { setUser } from "../../../redux/slices/user";


// Define response and payload types
interface RegisterResponse {
  success: boolean;
  message: string;
  token: string; // Added token to match your success response
  user: {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: string;
    status: string;
    created_at: string;
    updated_at: string;
  };
  errors?: { [key: string]: string[] };
}

interface ResetPasswordRequestResponse {
  success: boolean;
  message: string;
  errors?: { [key: string]: string[] };
}

interface RegisterArgs {
  name: string;
  email: string;
  phone: string;
  role: string;
  password: string;
}

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [checked, setChecked] = useState(false);
  const [errors, setErrors] = useState({});

  const navigation = useNavigation();
  const [register, { isLoading: isRegisterLoading, error }] = useRegisterMutation();
  const [requestVerifyEmail, { isLoading: isResetLoading }] = useResetPasswordRequestMutation();
  const dispatch = useDispatch(); // Add Redux dispatch

  const validateForm = () => {
    let tempErrors: { [key: string]: string } = {};
    if (!name) tempErrors.name = "Name is required";
    if (!email) tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) tempErrors.email = "Email is invalid";
    if (!phone) tempErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(phone)) tempErrors.phone = "Phone must be 10 digits";
    if (!password) tempErrors.password = "Password is required";
    else if (password.length < 6) tempErrors.password = "Password must be at least 6 characters";

    setErrors(tempErrors);
    console.log("Validation errors:", tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleRegister = async () => {
    console.log("Register button pressed");
    if (!validateForm()) {
      console.log("Validation failed");
      return;
    }

    console.log("Attempting registration with:", { name, email, phone, password });

    try {
      const payload: RegisterArgs = {
        name,
        email,
        phone,
        role: "customer",
        password,
      };

      console.log("Sending registration API request...");
      const registerResponse = await register(payload).unwrap();
      console.log("Registration API Response:", registerResponse);

      if (registerResponse.success) {
        console.log("Registration successful, storing token and user data...");
        await storeToken(registerResponse.token); // Store token in AsyncStorage
        await storeUserData(registerResponse.user); // Store user data in AsyncStorage
        dispatch(setUser(registerResponse.user)); // Store user data in Redux

        console.log("Requesting OTP for email verification...");
        const resetResponse = await requestVerifyEmail({ email }).unwrap();
        console.log("Reset Password Request Response:", resetResponse);

        if (resetResponse.success) {
          Alert.alert(
            "Success",
            resetResponse.message || "Registration successful! Please verify your email.",
            [
              {
                text: "OK",
                onPress: () =>
                  navigation.replace(ScreenNames.EMAIL_VERIFICATION, { email, mode: "verify" }),
              },
            ]
          );
        } else {
          let errorMessage = resetResponse.message || "Failed to send verification email";
          if (resetResponse.errors) {
            const errorDetails = Object.entries(resetResponse.errors)
              .map(([field, messages]) => {
                const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
                return `${fieldName}: ${messages.join(", ")}`;
              })
              .join("\n");
            errorMessage += `\n${errorDetails}`;
          }
          Alert.alert(
            "Registration Succeeded",
            `${errorMessage}\nPlease try resending the verification email or contact support.`,
            [
              {
                text: "OK",
                onPress: () => navigation.navigate(ScreenNames.EMAIL_VERIFICATION, { email }),
              },
            ]
          );
        }
      } else {
        let errorMessage = registerResponse.message || "Something went wrong";
        if (registerResponse.errors) {
          const errorDetails = Object.entries(registerResponse.errors)
            .map(([field, messages]) => {
              const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
              return `${fieldName}: ${messages.join(", ")}`;
            })
            .join("\n");
          errorMessage += `\n${errorDetails}`;
        }
        Alert.alert("Registration Failed", errorMessage);
      }
    } catch (error) {
      console.error("Registration error:", error);
      let errorMessage = "An error occurred while registering";

      if (error?.status && error?.data) {
        const apiError = error.data as RegisterResponse | ResetPasswordRequestResponse;
        errorMessage = apiError.message || "Registration failed";
        if (apiError.errors) {
          const errorDetails = Object.entries(apiError.errors)
            .map(([field, messages]) => {
              const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
              return `${fieldName}: ${messages.join(", ")}`;
            })
            .join("\n");
          errorMessage += `\n${errorDetails}`;
        }
      } else if (error?.status === "PARSING_ERROR" && error?.data?.includes("<!doctype html>")) {
        errorMessage = "Server error: Unexpected response received. Please try again later or contact support.";
      } else if (error?.message) {
        errorMessage = error.message;
      }

      Alert.alert("Registration Error", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate(ScreenNames.LOGIN)}
        disabled={isRegisterLoading || isResetLoading}
      >
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Name</Text>
      <TextInput
        mode="outlined"
        placeholder="Name here"
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholderTextColor="#888888"
        textColor="#000000"
        theme={{ roundness: 25, colors: { text: "#000000", primary: "#E65C3C" } }}
        disabled={isRegisterLoading || isResetLoading}
      />
      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

      <Text style={styles.label}>Email</Text>
      <TextInput
        mode="outlined"
        placeholder="Email here"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#888888"
        textColor="#000000"
        keyboardType="email-address"
        theme={{ roundness: 25, colors: { text: "#000000", primary: "#E65C3C" } }}
        disabled={isRegisterLoading || isResetLoading}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      <Text style={styles.label}>Phone</Text>
      <TextInput
        mode="outlined"
        placeholder="Phone number here"
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        placeholderTextColor="#888888"
        textColor="#000000"
        keyboardType="phone-pad"
        theme={{ roundness: 25, colors: { text: "#000000", primary: "#E65C3C" } }}
        disabled={isRegisterLoading || isResetLoading}
      />
      {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

      <Text style={styles.label}>Password</Text>
      <TextInput
        mode="outlined"
        placeholder="Password here"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#888888"
        textColor="#000000"
        secureTextEntry={!passwordVisible}
        right={
          <TextInput.Icon
            icon={passwordVisible ? "eye-off" : "eye"}
            onPress={() => setPasswordVisible(!passwordVisible)}
            color="#E65C3C"
          />
        }
        theme={{ roundness: 25, colors: { text: "#000000", primary: "#E65C3C" } }}
        disabled={isRegisterLoading || isResetLoading}
      />
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

      <View style={styles.rememberMeContainer}>
        <Checkbox
          status={checked ? "checked" : "unchecked"}
          onPress={() => setChecked(!checked)}
          color="#008000"
          disabled={isRegisterLoading || isResetLoading}
        />
        <Text style={styles.rememberMeText}>Remember me</Text>
      </View>

      <TouchableOpacity
        style={[styles.registerButton, (isRegisterLoading || isResetLoading) && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={isRegisterLoading || isResetLoading}
      >
        <Text style={styles.registerText}>
          {isRegisterLoading || isResetLoading ? "LOADING..." : "Sign up / Register"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.verificationText}>
        Verify your email through the confirmation link sent to your inbox.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  loginButton: {
    backgroundColor: "#E65C3C",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  loginText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    marginBottom: 10,
    backgroundColor: "#F9F9F9",
    height: 50,
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  rememberMeText: {
    fontSize: 16,
    color: "#333333",
    marginLeft: 8,
  },
  registerButton: {
    backgroundColor: "#E65C3C",
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 25,
  },
  buttonDisabled: {
    backgroundColor: "#E65C3CAA",
    opacity: 0.7,
  },
  registerText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  verificationText: {
    textAlign: "center",
    fontSize: 14,
    color: "#666666",
    marginTop: 15,
    fontWeight: "bold",
  },
  errorText: {
    color: "#DB4437",
    fontSize: 12,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
});

export default RegisterScreen;