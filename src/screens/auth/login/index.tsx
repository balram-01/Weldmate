import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import CountryPicker from "react-native-country-picker-modal";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ScreenNames from "../../../utils/screenNames";

const LoginScreen = () => {
  const [countryCode, setCountryCode] = useState("IN"); // Default country
  const [callingCode, setCallingCode] = useState("91"); // Default calling code
  const [visible, setVisible] = useState(false);
  const navigation =useNavigation()
  return (
    <View style={styles.container}>
      {/* Header Image */}
      <Image
        source={{
          uri: "https://picsum.photos/200/300",
        }}
        style={styles.image}
      />

      {/* Content Section */}
      <View style={styles.content}>
        {/* Logo */}
        <Text style={styles.logoText}>
          <Text style={styles.logoPrimary}>WELD</Text>
          <Text style={styles.logoSecondary}>MATE</Text>
        </Text>

        {/* Title */}
        <Text style={styles.title}>Log In or Sign Up</Text>

        {/* Phone Input Section */}
        <View style={styles.inputContainer}>
          {/* Country Picker */}
          <TouchableOpacity
            style={styles.countrySelector}
            onPress={() => setVisible(true)}
          >
            <Text style={styles.countryCode}>+{callingCode} ▼</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            
            placeholderTextColor={'#000'}
          />
        </View>

        {/* Country Picker Modal */}
        <CountryPicker
          withCallingCode
          withFilter
          withModal
          withAlphaFilter
          withFlag={false}
          countryCode={countryCode}
          visible={visible}
          onSelect={(country) => {
            setCountryCode(country.cca2);
            setCallingCode(country.callingCode[0]);
            setVisible(false);
          }}
          onClose={() => setVisible(false)}
        />


        {/* Continue Button */}
        <TouchableOpacity onPress={()=>{navigation.navigate(ScreenNames.HOME)}} style={styles.button}>
          <Text style={styles.buttonText}>CONTINUE</Text>
        </TouchableOpacity>

        {/* OR Divider */}
        <Text style={styles.orText}>──────── OR ────────</Text>

        {/* Google Sign-In Button */}
        <TouchableOpacity style={styles.googleButton}>
          <Icon name="google" size={22} color="#DB4437" />
          <Text style={styles.googleButtonText}>Continue with Google</Text>
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
  },
  countrySelector: { paddingRight: 10 },
  countryCode: { fontSize: 16, color: "#333", fontWeight: "600" },
  input: { flex: 1, fontSize: 16, color: "#000" },
  button: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  buttonText: { fontSize: 18, color: "#000", fontWeight: "bold" },
  orText: { marginVertical: 20, color: "#888", fontSize: 14 },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    borderRadius: 10,
    width: "100%",
    height: 50,
    justifyContent: "center",
  },
  googleButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
});

export default LoginScreen;