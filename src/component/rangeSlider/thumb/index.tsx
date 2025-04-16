import React from "react";
import { View, StyleSheet } from "react-native";

const Thumb = () => (
  <View style={styles.thumb} />
);

const styles = StyleSheet.create({
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "red",
  },
});

export default Thumb;