import React, { useRef, useState } from "react";
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
import { useResetPasswordRequestMutation, useVerifyOtpMutation } from "../../../redux/api/user";

interface VerifyOtpResponse {
  success: boolean;
  message?: string;
}

interface VerifyOtpPayload {
  email: string;
  otp: string;
}

const EmailVerificationScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {mode}=route.params;
  const [verifyOtp, { isLoading: isVerifyLoading }] = useVerifyOtpMutation();
  const [requestResetPassword, { isLoading: isResetLoading }] = useResetPasswordRequestMutation();
  const [email, setEmail] = useState(route?.params?.email || "");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleOtpChange = (value: string, index: number) => {
    if (value.length === 1 && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (value === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const resendOtp = async () => {
    try {
      const resetResponse = await requestResetPassword({ email }).unwrap();
      if (resetResponse.success) {
        Alert.alert("Success", "A new OTP has been sent to your email");
      } else {
        Alert.alert("Error", resetResponse.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      let errorMessage = "An error occurred while resending OTP";
      
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      Alert.alert("Error", errorMessage);
    }
  };

  const submitOtp = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      Alert.alert("Error", "Please enter a complete 6-digit OTP");
      return;
    }

    try {
      const payload: VerifyOtpPayload = {
        email,
        otp: otpValue,
      };

      const response = await verifyOtp(payload).unwrap();
      console.log("otp submit Response:", response);

      if (response.success) {
        if(mode=='verify') {
          navigation.replace(ScreenNames.HOME)   
        }else{
          navigation.replace(ScreenNames.RESET_PASSWORD, { email });
        }

      } else {
        Alert.alert(
          "Verification Failed",
          response.message || "Something went wrong"
        );
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      let errorMessage = "An error occurred while verifying OTP";

      if (error?.data) {
        const apiError = error.data as VerifyOtpResponse;
        errorMessage = apiError.message || errorMessage;
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
          customBgColor="#E3693C"
          customWavePattern="M0,192L80,202.7C160,213,320,235,480,229.3C640,224,800,192,960,192C1120,192,1280,224,1360,240L1440,256L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
        />
      </View>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Email Verification</Text>
      </View>

      {/* Email Heading */}
      <Text style={styles.emailHeading}>Get Your Code</Text>
      <Text style={styles.description}>
        Please enter the 6-digit code sent to your email address
      </Text>

      {/* Content */}
      <View style={styles.content}>
        {/* OTP Input Fields */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={styles.otpInput}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              editable={!isVerifyLoading && !isResetLoading} // Disable inputs during any loading
            />
          ))}
        </View>

        {/* Resend Code */}
        <TouchableOpacity 
          onPress={resendOtp}
          disabled={isResetLoading || isVerifyLoading}
        >
          <Text style={styles.resendText}>
            If you don’t receive code!{" "}
            <Text style={[
              styles.resendLink,
              (isResetLoading || isVerifyLoading) && styles.resendLinkDisabled
            ]}>
              {isResetLoading ? "Resending..." : "Resend"}
            </Text>
          </Text>
        </TouchableOpacity>

        {/* Verify and Proceed Button */}
        <TouchableOpacity
          onPress={submitOtp}
          style={[
            styles.verifyButton,
            (isVerifyLoading || isResetLoading) && styles.verifyButtonDisabled,
          ]}
          disabled={isVerifyLoading || isResetLoading}
        >
          <Text style={styles.verifyButtonText}>
            {isVerifyLoading ? "Verifying..." : "Verify and Proceed"}
          </Text>
        </TouchableOpacity>
      </View>
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
  svgCurve: {
    position: "relative",
    width: Dimensions.get("window").width,
  },
  content: {
    alignItems: "center",
    marginTop: 30,
  },
  description: {
    fontSize: 14,
    color: "#B5B5B5",
    textAlign: "center",
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#F1F1F1",
    textAlign: "center",
    fontSize: 18,
    marginHorizontal: 5,
  },
  resendText: {
    color: "#B5B5B5",
    fontSize: 14,
    marginBottom: 20,
  },
  resendLink: {
    color: "#E45537",
    fontWeight: "bold",
  },
  resendLinkDisabled: {
    color: "#B5B5B5",
    fontWeight: "normal",
  },
  verifyButton: {
    backgroundColor: "#E45537",
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 50,
  },
  verifyButtonDisabled: {
    backgroundColor: "#E45537AA",
    opacity: 0.7,
  },
  verifyButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});

export default EmailVerificationScreen;