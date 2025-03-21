import React, { useState } from "react";
import { View, StyleSheet, TextInput, TouchableOpacity, Dimensions } from "react-native";
import { Text } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import WavyHeader from "../../../component/weavyBg";
import { useNavigation } from "@react-navigation/native";
import ScreenNames from "../../../utils/screenNames";

const ResetPasswordScreen = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
 const navigation =useNavigation()
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
        <TouchableOpacity style={styles.backButton}>
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
        />
      </View>

      {/* Continue Button */}
      <TouchableOpacity onPress={()=>{navigation.navigate(ScreenNames.LOGIN)}} style={styles.continueButton}>
        <Text style={styles.continueButtonText}>Continue</Text>
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
