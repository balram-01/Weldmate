import React from "react";
import { View, StyleSheet } from "react-native";

const RailSelected = () => (
  <View style={styles.railSelected} />
);

const styles = StyleSheet.create({
  railSelected: {
    flex: 1,
    height: 10,
    borderRadius: 4,
    backgroundColor: "red",
  },
});

export default RailSelected;