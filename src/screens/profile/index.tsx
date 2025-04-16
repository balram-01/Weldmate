import React, { useState, useCallback, useMemo } from "react";
import { View, ScrollView, StyleSheet, RefreshControl, TouchableOpacity } from "react-native";
import { Avatar, Divider, Text } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import Animated, { FadeInUp, FadeInRight, useSharedValue, withSpring, useAnimatedStyle } from "react-native-reanimated";
import LinearGradient from "react-native-linear-gradient";
import ScreenNames from "../../utils/screenNames";
import { removeToken } from "../../utils/authStorage";
import { RootState } from "../../redux/store";
import { noProfile_image } from "../../images";

type RootStackParamList = {
  [ScreenNames.LOGIN]: undefined;
  [ScreenNames.PAYMENT_DETAILS]: undefined;
  [ScreenNames.ORDER_DETAILS]: undefined;
  [ScreenNames.ADDRESS_DETAILS_SCREEN]: undefined;
  [ScreenNames.EDIT_PROFILE]: undefined;
};

interface ListItem {
  title: string;
  icon: string;
  color?: string;
  onPress?: () => void;
}

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { user, isLoading, error } = useSelector((state: RootState) => state.user);
  const [refreshing, setRefreshing] = useState(false);

  const handleLogout = async () => {
    try {
      await removeToken();
      navigation.replace(ScreenNames.LOGIN);
    } catch (err) {
      console.error("Error removing token:", err);
      navigation.replace(ScreenNames.LOGIN);
    }
  };

  const handleEditProfile = () => {
    navigation.navigate(ScreenNames.EDIT_PROFILE, { id: user?.id });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const getAvatarSource = () => {
    return user?.avatarUrl ? { uri: user.avatarUrl } : noProfile_image;
  };

  const paymentItems = useMemo<ListItem[]>(() => [
    {
      title: "Bank & UPI Details",
      icon: "bank",
      onPress: () => navigation.navigate(ScreenNames.PAYMENT_DETAILS),
    },
  ], [navigation]);

  const activityItems = useMemo<ListItem[]>(() => [
    { title: "Wishlisted Product", icon: "heart", color: "#FF6D00" },
    { title: "Shared Product", icon: "share-variant", color: "#FF6D00" },
    {
      title: "My Orders",
      icon: "clipboard-list",
      onPress: () => navigation.navigate(ScreenNames.ORDER_DETAILS),
    },
    {
      title: "Add Address",
      icon: "map-marker",
      onPress: () => navigation.navigate(ScreenNames.ADDRESS_DETAILS_SCREEN),
    },
  ], [navigation]);

  const otherItems = useMemo<ListItem[]>(() => [
    { title: "Edit Profile", icon: "pencil", onPress: handleEditProfile },
    { title: "Settings", icon: "cog" },
    { title: "Logout", icon: "logout", onPress: handleLogout },
  ], [handleLogout, handleEditProfile]);

  if (isLoading) {
    return (
      <Animated.View entering={FadeInUp} style={styles.stateContainer}>
        <Text style={styles.stateText}>Loading profile...</Text>
      </Animated.View>
    );
  }

  if (error) {
    return (
      <Animated.View entering={FadeInUp} style={styles.stateContainer}>
        <Icon name="alert-circle-outline" size={32} color="#FF6D00" />
        <Text style={styles.stateText}>Error: {error}</Text>
      </Animated.View>
    );
  }

  const displayName = user?.name || "Guest";
  const displayEmail = user?.email || "No email available";

  const ListItemComponent = ({ item, index }: { item: ListItem; index: number }) => {
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    return (
      <Animated.View entering={FadeInRight.delay(index * 100)} style={[styles.listItemCard, animatedStyle]}>
        <TouchableOpacity
          onPress={item.onPress}
          onPressIn={() => (scale.value = withSpring(0.98))}
          onPressOut={() => (scale.value = withSpring(1))}
          disabled={!item.onPress}
        >
          <View style={styles.listItemContent}>
            <Icon
              name={item.icon}
              size={24}
              color={item.color || "#FF6D00"}
              style={styles.iconStyle}
            />
            <Text style={styles.listItemText}>{item.title}</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#FF6D00"]}
        />
      }
    >
      {/* Header */}
      <Animated.View entering={FadeInUp}>
        <LinearGradient colors={["#FFD814", "#FF6D00"]} style={styles.header}>
          <Avatar.Image
            size={100}
            source={getAvatarSource()}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.name}>{displayName}</Text>
            <Text style={styles.email}>{displayEmail}</Text>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Payments Section */}
      <Animated.View entering={FadeInUp.delay(200)} style={styles.sectionCard}>
        <LinearGradient colors={["#FFD814", "#FF6D00"]} style={styles.subheader}>
          <Text style={styles.subheaderText}>My Payments</Text>
        </LinearGradient>
        {paymentItems.map((item, index) => (
          <ListItemComponent key={index} item={item} index={index} />
        ))}
      </Animated.View>

      {/* Activity Section */}
      <Animated.View entering={FadeInUp.delay(300)} style={styles.sectionCard}>
        <LinearGradient colors={["#00838F", "#00ACC1"]} style={styles.subheader}>
          <Text style={styles.subheaderText}>My Activity</Text>
        </LinearGradient>
        {activityItems.map((item, index) => (
          <ListItemComponent key={index} item={item} index={index} />
        ))}
      </Animated.View>

      {/* Others Section */}
      <Animated.View entering={FadeInUp.delay(400)} style={styles.sectionCard}>
        <LinearGradient colors={["#455A64", "#78909C"]} style={styles.subheader}>
          <Text style={styles.subheaderText}>Others</Text>
        </LinearGradient>
        {otherItems.map((item, index) => (
          <ListItemComponent key={index} item={item} index={index} />
        ))}
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  contentContainer: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  avatar: {
    borderWidth: 2,
    borderColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontFamily: "Roboto-Bold",
    color: "#FFF",
  },
  email: {
    fontSize: 16,
    fontFamily: "Roboto-Regular",
    color: "#FFF",
    marginTop: 4,
  },
  sectionCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  subheader: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  subheaderText: {
    fontSize: 16,
    fontFamily: "Roboto-Bold",
    color: "#FFF",
  },
  listItemCard: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginHorizontal: 8,
    marginVertical: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  listItemContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  listItemText: {
    fontSize: 16,
    fontFamily: "Roboto-Regular",
    color: "#1A2526",
    marginLeft: 16,
  },
  iconStyle: {
    width: 24,
  },
  stateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    margin: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  stateText: {
    fontSize: 16,
    fontFamily: "Roboto-Regular",
    color: "#1A2526",
    marginTop: 8,
    textAlign: "center",
  },
});

export default ProfileScreen;