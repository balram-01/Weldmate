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
import { useNavigation } from "@react-navigation/native";
import ScreenNames from "../../../utils/screenNames";
import { useResetPasswordRequestMutation } from "../../../redux/api/user";

// Define response type
interface ResetPasswordRequestResponse {
  success: boolean;
  message: string;
  errors?: {
    email?: string[];
    [key: string]: string[] | undefined;
  };
}

interface ResetPasswordRequestPayload {
  email: string;
}

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [requestOtpOnMail, { isLoading }] = useResetPasswordRequestMutation();
  const navigation = useNavigation();

  // Email validation function
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleResetPasswordRequest = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter an email address");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    try {
      const payload: ResetPasswordRequestPayload = { email };
      console.log('sending reset password request',payload)
      const response = await requestOtpOnMail(payload).unwrap();
      console.log("Reset password request response:", response);

      if (response.success) {
        Alert.alert(
          "Success",
          response.message || "OTP sent to your email successfully",
          [
            {
              text: "OK",
              onPress: () => navigation.replace(ScreenNames.EMAIL_VERIFICATION, { email }),
            },
          ]
        );
      } else {
        let errorMessage = response.message;
        if (response.errors) {
          const errorDetails = Object.entries(response.errors)
            .map(([field, messages]) => {
              const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
              return `${fieldName}: ${messages?.join(", ")}`;
            })
            .join("\n");
          errorMessage += `\n${errorDetails}`;
        }
        Alert.alert("Error", errorMessage);
      }
    } catch (error) {
      console.error("Reset password request error:", error);
      let errorMessage = "An error occurred while requesting password reset";

      // Handle HTML response or parsing error
      if (error?.status === "PARSING_ERROR" && error?.data?.includes("<!doctype html>")) {
        errorMessage = "Server error: Unexpected response received. Please try again later or contact support.";
      } else if (error?.data) {
        const apiError = error.data as ResetPasswordRequestResponse;
        errorMessage = apiError.message || errorMessage;
        if (apiError.errors) {
          const errorDetails = Object.entries(apiError.errors)
            .map(([field, messages]) => {
              const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
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
      <View style={{ height: 160 }}>
        <WavyHeader
          customStyles={styles.svgCurve}
          customHeight={160}
          customTop={150}
          customBgColor="#E3693C"
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
        <Text style={styles.headerText}>Forgot Password</Text>
      </View>

      <Text style={styles.emailHeading}>Mail Address Here</Text>
      <Text style={styles.description}>
        Enter the email address associated with your account.
      </Text>

      <Text style={styles.label}>Email</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="@gmail.com"
          placeholderTextColor="#B5B5B5"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          editable={!isLoading}
          autoCapitalize="none"
        />
      </View>

      <TouchableOpacity
        onPress={handleResetPasswordRequest}
        style={[styles.recoverButton, isLoading && styles.recoverButtonDisabled]}
        disabled={isLoading}
      >
        <Text style={styles.recoverButtonText}>
          {isLoading ? "Sending..." : "Recover Password"}
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
  emailHeading: {
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
    backgroundColor: "#FAFAFA",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 20,
  },
  input: {
    fontSize: 16,
    color: "black",
  },
  recoverButton: {
    backgroundColor: "#E45537",
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: 20,
  },
  recoverButtonDisabled: {
    backgroundColor: "#E45537AA",
    opacity: 0.7,
  },
  recoverButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  svgCurve: {
    position: "relative",
    width: Dimensions.get("window").width,
  },
});

export default ForgotPasswordScreen;