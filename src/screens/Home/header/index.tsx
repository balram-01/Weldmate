import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const Header = () => {
  return (
    <View style={{ backgroundColor: "#F15A29", padding: 10, flexDirection: "row", alignItems: "center" }}>
      {/* Profile Icon */}
      <TouchableOpacity>
        <Ionicons name="person-outline" size={24} color="white" />
      </TouchableOpacity>

      {/* Search Bar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "white",
          borderRadius: 10,
          flex: 1,
          marginHorizontal: 10,
          paddingHorizontal: 10,
          paddingVertical: 5,
        }}
      >
        <Ionicons name="search" size={20} color="gray" />
        <TextInput
          placeholder="Search Here"
          placeholderTextColor="gray"
          style={{ flex: 1, marginLeft: 5 }}
        />
        <TouchableOpacity>
          <MaterialIcons name="photo-camera" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* QR Code Scanner Icon */}
      <TouchableOpacity>
        <Ionicons name="qr-code-outline" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default Header;