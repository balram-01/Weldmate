import React, { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Text } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import WavyHeader from "../../../component/weavyBg";
import { useNavigation } from "@react-navigation/native";
import ScreenNames from "../../../utils/screenNames";

const EmailVerificationScreen = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);
 const navigation =useNavigation()
  const handleOtpChange = (value, index) => {
    if (value.length === 1 && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus(); // Move cursor to next input
    }

    if (value === "" && index > 0) {
      inputRefs.current[index - 1]?.focus(); // Move cursor to previous input on delete
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
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
        <TouchableOpacity style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Email Verification</Text>
      </View>

      {/* Email Heading */}
      <Text style={styles.emailHeading}>Get Your Code</Text>
      <Text style={styles.description}>
        Please enter the 4-digit code sent to your email address
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
            />
          ))}
        </View>

        {/* Resend Code */}
        <Text style={styles.resendText}>
          If you don’t receive code!{" "}
          <Text style={styles.resendLink}>Resend</Text>
        </Text>

        {/* Verify and Proceed Button */}
        <TouchableOpacity onPress={()=>{navigation.navigate(ScreenNames.RESET_PASSWORD)}} style={styles.verifyButton}>
          <Text style={styles.verifyButtonText}>Verify and Proceed</Text>
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
  recoverButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  svgCurve: {
    position: "relative",
    width: Dimensions.get("window").width,
  },
  content: {
    alignItems: "center",
    marginTop: 30, // Push content below the header
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E45537",
    marginTop: 20,
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
  verifyButton: {
    backgroundColor: "#E45537",
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 50,
  },
  verifyButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});

export default EmailVerificationScreen;
