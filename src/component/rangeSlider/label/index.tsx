import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Label = ({ text }) => (
  <View style={styles.label}>
    <Text style={styles.labelText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  label: {
    backgroundColor: "red",
    padding: 4,
    borderRadius: 4,
  },
  labelText: {
    color: "white",
    fontSize: 12,
  },
});

export default Label;