import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import RangeSlider from "rn-range-slider";
import Notch from "./notch";
import Rail from "./rail";
import RailSelected from "./railSelected";
import Thumb from "./thumb";
import Label from "./label";



const PriceFilter = () => {
  const [low, setLow] = useState(6);
  const [high, setHigh] = useState(25);

  const renderThumb = useCallback(() => <Thumb />, []);
  const renderRail = useCallback(() => <Rail />, []);
  const renderRailSelected = useCallback(() => <RailSelected />, []);
  const renderLabel = useCallback((value) => <Label text={value} />, []);
  const renderNotch = useCallback(() => <Notch />, []);
  const handleValueChange = useCallback((low, high) => {
    setLow(low);
    setHigh(high);
  }, []);

  return (
    <View style={styles.container}>
      <RangeSlider
        style={styles.slider}
        min={0}
        max={50}
        step={1}
        floatingLabel
        renderThumb={renderThumb}
        renderRail={renderRail}
        renderRailSelected={renderRailSelected}
        renderLabel={renderLabel}
        renderNotch={renderNotch}
        onValueChanged={handleValueChange}
      />

      <View style={styles.footer}>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>FILTER</Text>
        </TouchableOpacity>
        <Text style={styles.priceText}>Price: ${low} — ${high}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  slider: {
    width: "100%",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  filterButton: {
    borderWidth: 2,
    borderColor: "red",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  filterText: {
    color: "red",
    fontWeight: "bold",
  },
  priceText: {
    color: "gray",
    fontSize: 16,
  },
});

export default PriceFilter;