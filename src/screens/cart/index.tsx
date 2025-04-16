import React, { useEffect, useCallback, memo } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
  selectCartItems,
  selectCartTotal,
  loadCart,
} from "../../redux/slices/cart/cartSlice"; // Adjust path as needed
import Ionicons from "react-native-vector-icons/Ionicons";
import Toast from "react-native-toast-message";
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  withSpring,
  useAnimatedStyle,
} from "react-native-reanimated";
import LinearGradient from "react-native-linear-gradient";
import { productImages } from "../../images"; // Adjust path as needed

const { width, height } = Dimensions.get("window");

const FALLBACK_IMAGE = productImages.banner_welding_machine; // Fallback image from SearchScreen

// Memoized Cart Item Component
const CartItem = memo(
  ({
    item,
    handleDecreaseQuantity,
    handleIncreaseQuantity,
    handleRemoveFromCart,
  }: any) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));
console.log('item.image ',item.image )
    return (
      <Animated.View
        style={[styles.cartItem, animatedStyle]}
        entering={FadeInDown}
      >
        <Image
          source={item.image ? { uri: String(item.image )} : FALLBACK_IMAGE}
          style={styles.productImage}
          onError={() => console.log("Cart item image load error")}
        />
        <View style={styles.itemDetails}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.productPrice}>
            ₹{(item.price * item.quantity).toFixed(2)} (₹{item.price.toFixed(2)}{" "}
            x {item.quantity})
          </Text>
          <View style={styles.cartControls}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleDecreaseQuantity(item.id, item.quantity)}
              onPressIn={() => (scale.value = withSpring(0.95))}
              onPressOut={() => (scale.value = withSpring(1))}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleIncreaseQuantity(item.id, item.quantity)}
              onPressIn={() => (scale.value = withSpring(0.95))}
              onPressOut={() => (scale.value = withSpring(1))}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleRemoveFromCart(item.id, item.name)}
              onPressIn={() => (scale.value = withSpring(0.95))}
              onPressOut={() => (scale.value = withSpring(1))}
            >
              <Ionicons name="trash" size={14} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  }
);

// Empty Cart Component
const EmptyCart = memo(() => (
  <Animated.View style={styles.emptyContainer} entering={FadeInUp}>
    <Ionicons name="cart-outline" size={80} color="#666" />
    <Text style={styles.emptyText}>Your cart is empty</Text>
    <Text style={styles.emptySubText}>
      Add some products to start shopping!
    </Text>
    <LinearGradient
      colors={["#FFD814", "#FF6D00"]}
      style={styles.shopNowButton}
    >
      <TouchableOpacity>
        <Text style={styles.shopNowText}>Shop Now</Text>
      </TouchableOpacity>
    </LinearGradient>
  </Animated.View>
));

const CartScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const initialize = async () => {
      await dispatch(loadCart());
      setIsLoading(false);
    };
    initialize();
  }, [dispatch]);

  const handleDecreaseQuantity = useCallback(
    (id: string, currentQuantity: number) => {
      if (currentQuantity === 1) {
        dispatch(removeFromCart(id));
        Toast.show({
          type: "info",
          text1: "Removed from Cart",
          text2: "Item removed successfully.",
          position: "top",
        });
      } else {
        dispatch(updateQuantity({ id, quantity: currentQuantity - 1 }));
      }
    },
    [dispatch]
  );

  const handleIncreaseQuantity = useCallback(
    (id: string, currentQuantity: number) => {
      dispatch(updateQuantity({ id, quantity: currentQuantity + 1 }));
    },
    [dispatch]
  );

  const handleRemoveFromCart = useCallback(
    (id: string, name: string) => {
      dispatch(removeFromCart(id));
      Toast.show({
        type: "info",
        text1: "Removed from Cart",
        text2: `${name} removed successfully.`,
        position: "top",
      });
    },
    [dispatch]
  );

  const handleClearCart = useCallback(() => {
    dispatch(clearCart());
    Toast.show({
      type: "info",
      text1: "Cart Cleared",
      text2: "All items removed from cart.",
      position: "top",
    });
  }, [dispatch]);

  const handleCheckout = useCallback(() => {
    // Placeholder for checkout navigation or logic
    Toast.show({
      type: "success",
      text1: "Proceeding to Checkout",
      text2: "Redirecting to payment...",
      position: "top",
    });
    // navigation.navigate('CheckoutScreen'); // Uncomment if checkout screen exists
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6D00" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A2526" />
      <LinearGradient colors={["#1A2526", "#2E3B3C"]} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Cart</Text>
        {cartItems.length > 0 && (
          <TouchableOpacity onPress={handleClearCart}>
            <Ionicons name="trash-outline" size={24} color="#FF4444" />
          </TouchableOpacity>
        )}
      </LinearGradient>

      {cartItems.length === 0 ? (
        <EmptyCart />
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <CartItem
                item={item}
                handleDecreaseQuantity={handleDecreaseQuantity}
                handleIncreaseQuantity={handleIncreaseQuantity}
                handleRemoveFromCart={handleRemoveFromCart}
              />
            )}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
          <Animated.View style={styles.summaryContainer} entering={FadeInUp}>
            <LinearGradient
              colors={["#FFF", "#F7F7F7"]}
              style={styles.summaryGradient}
            >
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>
                  Subtotal ({cartItems.length} items):
                </Text>
                <Text style={styles.summaryValue}>₹{cartTotal.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping:</Text>
                <Text style={styles.summaryValue}>Free</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total:</Text>
                <Text style={styles.summaryTotal}>₹{cartTotal.toFixed(2)}</Text>
              </View>
              <LinearGradient
                colors={["#FFD814", "#FF6D00"]}
                style={styles.checkoutButton}
              >
                <TouchableOpacity onPress={handleCheckout}>
                  <Text style={styles.checkoutText}>Proceed to Checkout</Text>
                </TouchableOpacity>
              </LinearGradient>
            </LinearGradient>
          </Animated.View>
        </>
      )}

      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    paddingTop: 48,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "Roboto-Bold",
    color: "#FFF",
  },
  listContainer: {
    padding: 16,
    paddingBottom: 200, // Space for summary
  },
  summaryContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "transparent",
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  productImage: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    borderRadius: 12,
    backgroundColor: "#F9F9F9",
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 16,
    fontFamily: "Roboto-Medium",
    color: "#1A2526",
    lineHeight: 22,
  },
  productPrice: {
    fontSize: 14,
    fontFamily: "Roboto-Regular",
    color: "#666",
    marginVertical: 6,
  },
  cartControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    backgroundColor: "#4CAF50",
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 4,
  },
  quantityButtonText: {
    fontSize: 18,
    color: "#FFF",
    fontFamily: "Roboto-Bold",
  },
  quantityText: {
    fontSize: 16,
    fontFamily: "Roboto-Medium",
    color: "#333",
    marginHorizontal: 8,
  },
  deleteButton: {
    backgroundColor: "#FF4444",
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  emptyText: {
    fontSize: 20,
    fontFamily: "Roboto-Bold",
    color: "#1A2526",
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 16,
    fontFamily: "Roboto-Regular",
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },
  shopNowButton: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  shopNowText: {
    fontSize: 16,
    fontFamily: "Roboto-Bold",
    color: "#FFF",
  },

  summaryGradient: {
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  summaryLabel: {
    fontSize: 16,
    fontFamily: "Roboto-Medium",
    color: "#1A2526",
  },
  summaryValue: {
    fontSize: 16,
    fontFamily: "Roboto-Regular",
    color: "#1A2526",
  },
  summaryTotal: {
    fontSize: 18,
    fontFamily: "Roboto-Bold",
    color: "#FF6D00",
  },
  checkoutButton: {
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  checkoutText: {
    fontSize: 18,
    fontFamily: "Roboto-Bold",
    color: "#FFF",
  },
});

export default CartScreen;
