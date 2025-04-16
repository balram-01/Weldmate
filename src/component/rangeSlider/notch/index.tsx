import React from "react";
import { View, StyleSheet } from "react-native";

const Notch = () => <View style={styles.notch} />;

const styles = StyleSheet.create({
  notch: {
    width: 8,
    height: 8,
    backgroundColor: "red",
    borderRadius: 4,
  },
});

export default Notch;