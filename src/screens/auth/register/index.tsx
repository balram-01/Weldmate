import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { TextInput, Checkbox } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ScreenNames from "../../../utils/screenNames";

const RegisterScreen = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [checked, setChecked] = useState(false);
  const navigation =useNavigation()
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Name</Text>
      <TextInput
        mode="outlined"
        placeholder="Name here"
        style={styles.input}
        placeholderTextColor="#C4C4C4"
        theme={{ roundness: 25 }}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        mode="outlined"
        placeholder="Email here"
        style={styles.input}
        placeholderTextColor="#C4C4C4"
        keyboardType="email-address"
        theme={{ roundness: 25 }}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        mode="outlined"
        placeholder="Password here"
        style={styles.input}
        placeholderTextColor="#C4C4C4"
        secureTextEntry={!passwordVisible}
        right={
          <TextInput.Icon
            icon={passwordVisible ? "eye-off" : "eye"}
            onPress={() => setPasswordVisible(!passwordVisible)}
          />
        }
        theme={{ roundness: 25 }}
      />

      <View style={styles.rememberMeContainer}>
        <Checkbox
          status={checked ? "checked" : "unchecked"}
          onPress={() => setChecked(!checked)}
          color="#008000"
        />
        <Text style={styles.rememberMeText}>Remember me</Text>
      </View>

      <TouchableOpacity onPress={()=>{navigation.navigate(ScreenNames.HOME)}} style={styles.registerButton}>
        <Text style={styles.registerText}>Sign up / Register</Text>
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
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    marginBottom: 15,
    backgroundColor: "#F9F9F9",
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  rememberMeText: {
    fontSize: 16,
    marginLeft: 8,
  },
  registerButton: {
    backgroundColor: "#E65C3C",
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 25,
  },
  registerText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  verificationText: {
    textAlign: "center",
    fontSize: 14,
    color: "#A0A0A0",
    marginTop: 15,
    fontWeight: "bold",
  },
});

export default RegisterScreen;
