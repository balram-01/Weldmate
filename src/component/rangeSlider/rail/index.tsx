import React from "react";
import { View, StyleSheet } from "react-native";

const Rail = () => (
  <View style={styles.rail} />
);

const styles = StyleSheet.create({
  rail: {
    flex: 1,
    height: 10,
    borderRadius: 4,
    backgroundColor: "#E0E0E0",
  },
});

export default Rail;