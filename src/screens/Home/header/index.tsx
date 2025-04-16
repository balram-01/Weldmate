import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import ScreenNames from "../../../utils/screenNames";
import { useNavigation } from "@react-navigation/native";
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  FadeInUp,
} from "react-native-reanimated";
import LinearGradient from "react-native-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const Header = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  // Animation scales for interactivity
  const profileScale = useSharedValue(1);
  const searchScale = useSharedValue(1);
  const qrScale = useSharedValue(1);
  const cameraScale = useSharedValue(1);

  const profileAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: profileScale.value }],
  }));

  const searchAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: searchScale.value }],
  }));

  const qrAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: qrScale.value }],
  }));

  const cameraAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cameraScale.value }],
  }));

  return (
    <Animated.View
      style={[styles.container, ]}
      entering={FadeInUp}
    >
      <LinearGradient
        colors={["#FFD814", "#FF6D00"]}
        style={styles.gradient}
      >
        {/* Profile Icon */}
        <Animated.View style={profileAnimatedStyle}>
          <TouchableOpacity
            onPress={() => navigation.navigate(ScreenNames.PROFILE_SCREEN)}
            onPressIn={() => (profileScale.value = withSpring(0.98))}
            onPressOut={() => (profileScale.value = withSpring(1))}
            style={styles.iconButton}
          >
            <LinearGradient
              colors={["#FFF", "#F7F7F7"]}
              style={styles.iconGradient}
            >
              <Ionicons name="person-circle" size={36} color="#FF6D00" />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Search Bar */}
        <Animated.View style={[styles.searchContainer, searchAnimatedStyle]}>
          <TouchableOpacity
            onPress={() => navigation.navigate(ScreenNames.SEARCH_SCREEN)}
            onPressIn={() => (searchScale.value = withSpring(0.98))}
            onPressOut={() => (searchScale.value = withSpring(1))}
            style={styles.searchTouchable}
            activeOpacity={1}
          >
            <LinearGradient
              colors={["#FFF", "#F7F7F7"]}
              style={styles.searchGradient}
            >
              <Ionicons name="search" size={22} color="#FF6D00" style={styles.searchIcon} />
              <TextInput
                editable={false}
                placeholder="Search Here"
                placeholderTextColor="#666"
                style={styles.searchInput}
              />
              {/* <Animated.View style={cameraAnimatedStyle}>
                <TouchableOpacity
                  onPress={() => navigation.navigate("CameraScreen")} // Placeholder
                  onPressIn={() => (cameraScale.value = withSpring(0.98))}
                  onPressOut={() => (cameraScale.value = withSpring(1))}
                >
                  <MaterialIcons name="photo-camera" size={22} color="#1A2526" />
                </TouchableOpacity>
              </Animated.View> */}
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* QR Code Scanner Icon */}
        {/* <Animated.View style={qrAnimatedStyle}>
          <TouchableOpacity
            onPress={() => navigation.navigate("QRScannerScreen")} // Placeholder
            onPressIn={() => (qrScale.value = withSpring(0.98))}
            onPressOut={() => (qrScale.value = withSpring(1))}
            style={styles.iconButton}
          >
            <LinearGradient
              colors={["#FFF", "#F7F7F7"]}
              style={styles.iconGradient}
            >
              <Ionicons name="qr-code-outline" size={28} color="#FF6D00" />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View> */}
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
  },
  gradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  iconButton: {
    padding: 4,
  },
  iconGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  searchContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  searchTouchable: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchGradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Roboto-Regular",
    color: "#1A2526",
    paddingVertical: 0,
  },
});

export default Header;