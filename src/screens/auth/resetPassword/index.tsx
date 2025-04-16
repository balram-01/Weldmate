import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import { Text } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import WavyHeader from "../../../component/weavyBg";
import { useNavigation, useRoute } from "@react-navigation/native";
import ScreenNames from "../../../utils/screenNames";
import { useResetPasswordMutation } from "../../../redux/api/user";

// Define API response and payload types
interface ResetPasswordResponse {
  success: boolean;
  message: string;
  errors?: {
    email?: string[];
    new_password?: string[];
    [key: string]: string[] | undefined;
  };
}

interface ResetPasswordPayload {
  email: string;
  new_password: string;
  new_password_confirmation: string;
}

const ResetPasswordScreen = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const navigation = useNavigation();
  const route = useRoute();
  const email = route?.params?.email || ""; // Get email from navigation params

  // Validation function
  const validateInputs = () => {
    if (!password) {
      Alert.alert("Error", "Please enter a new password");
      return false;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return false;
    }
    if (!confirmPassword) {
      Alert.alert("Error", "Please confirm your password");
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return false;
    }
    return true;
  };

  const handleResetPassword = async () => {
    if (!validateInputs()) {
      return;
    }

    try {
      const payload: ResetPasswordPayload = {
        email,
        new_password: password,
        new_password_confirmation: confirmPassword,
      };
      const response = await resetPassword(payload).unwrap();
      console.log("Reset password response:", response);

      if (response.success) {
        Alert.alert(
          "Success",
          response.message || "Password reset successfully",
          [
            {
              text: "OK",
              onPress: () => navigation.replace(ScreenNames.LOGIN),
            },
          ]
        );
      } else {
        let errorMessage = response.message; // "Validation failed"
        if (response.errors) {
          const errorDetails = Object.entries(response.errors)
            .map(([field, messages]) => {
              const fieldName =
                field === "new_password" ? "Password" : field.charAt(0).toUpperCase() + field.slice(1);
              return `${fieldName}: ${messages?.join(", ")}`;
            })
            .join("\n");
          errorMessage += `\n${errorDetails}`; // "Email: The selected email is invalid."
        }
        Alert.alert("Error", errorMessage);
      }
    } catch (error) {
      console.error("Reset password error:", error);
      let errorMessage = "An error occurred while resetting password";

      if (error?.status === "PARSING_ERROR" && error?.data?.includes("<!doctype html>")) {
        errorMessage = "Server error: Unexpected response received. Please try again later or contact support.";
      } else if (error?.data) {
        const apiError = error.data as ResetPasswordResponse;
        errorMessage = apiError.message || errorMessage;
        if (apiError.errors) {
          const errorDetails = Object.entries(apiError.errors)
            .map(([field, messages]) => {
              const fieldName =
                field === "new_password" ? "Password" : field.charAt(0).toUpperCase() + field.slice(1);
              return `${fieldName}: ${messages?.join(", ")}`;
            })
            .join("\n");
          errorMessage += `\n${errorDetails}`;
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }

      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      {/* Wavy Header */}
      <View style={{ height: 160 }}>
        <WavyHeader
          customStyles={styles.svgCurve}
          customHeight={160}
          customTop={150}
          customBgColor="#E45537"
          customWavePattern="M0,192L80,202.7C160,213,320,235,480,229.3C640,224,800,192,960,192C1120,192,1280,224,1360,240L1440,256L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
        />
      </View>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          disabled={isLoading}
        >
          <Icon name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Reset Password</Text>
      </View>

      {/* Enter New Password Heading */}
      <Text style={styles.heading}>Enter New Password</Text>
      <Text style={styles.description}>
        Your new password must be different from previously used password.
      </Text>

      {/* Password Input */}
      <Text style={styles.label}>Password</Text>
      <View style={styles.inputContainer}>
        <Icon name="lock-outline" size={20} color="#B5B5B5" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="********"
          placeholderTextColor="#B5B5B5"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!isLoading}
        />
      </View>

      {/* Confirm Password Input */}
      <Text style={styles.label}>Confirm Password</Text>
      <View style={styles.inputContainer}>
        <Icon name="lock-outline" size={20} color="#B5B5B5" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="********"
          placeholderTextColor="#B5B5B5"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          editable={!isLoading}
        />
      </View>

      {/* Continue Button */}
      <TouchableOpacity
        onPress={handleResetPassword}
        style={[styles.continueButton, isLoading && styles.continueButtonDisabled]}
        disabled={isLoading}
      >
        <Text style={styles.continueButtonText}>
          {isLoading ? "Resetting..." : "Continue"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  headerContainer: {
    position: "absolute",
    top: 80,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: 0,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E45537",
    textAlign: "center",
    marginTop: 100,
  },
  description: {
    fontSize: 14,
    color: "#B5B5B5",
    textAlign: "center",
    marginBottom: 25,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
    marginBottom: 5,
    marginLeft: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 20,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "black",
  },
  icon: {
    marginRight: 10,
  },
  continueButton: {
    backgroundColor: "#E45537",
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: 20,
  },
  continueButtonDisabled: {
    backgroundColor: "#E45537AA",
    opacity: 0.7,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  svgCurve: {
    position: "relative",
    width: Dimensions.get("window").width,
  },
});

export default ResetPasswordScreen;