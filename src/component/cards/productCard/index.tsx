// ProductCard.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
} from "react-native-reanimated";
import LinearGradient from "react-native-linear-gradient";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-toast-message";

import {
  addToWishlist,
  removeFromWishlist,
  selectWishlistItems,
} from "../../../redux/slices/wishlist/wishlistSlice";
import { useAddToWishlistMutation, useRemoveFromWishlistMutation } from "../../../redux/api/product";
import { RootState } from "../../../redux/store";

interface Product {
  id: string | number;
  name: string;
  price: number | string;
  image?: any;
  quantity?: number;
}

interface ProductCardProps {
  product: Product;
  isRecentSearch?: boolean;
  onPress: () => void;
  onAddToCart: (product: Product) => void;
  onDecreaseQuantity: (id: string, quantity: number) => void;
  onIncreaseQuantity: (id: string, quantity: number) => void;
  onRemoveFromCart: (id: string, name: string) => void;
  getCartItemQuantity: (id: string | number) => number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isRecentSearch = false,
  onPress,
  onAddToCart,
  onDecreaseQuantity,
  onIncreaseQuantity,
  onRemoveFromCart,
  getCartItemQuantity,
}) => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector(selectWishlistItems);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const quantity = getCartItemQuantity(product.id);
  const isInCart = quantity > 0;
  const scale = useSharedValue(1);
  const wishlistScale = useSharedValue(1);
  const [addToWishlistApi, { isLoading: isAddingWishlist }] = useAddToWishlistMutation();
  const [removeFromWishlistApi, { isLoading: isRemovingWishlist }] = useRemoveFromWishlistMutation();
    const { user, isLoading, error } = useSelector((state: RootState) => state.user);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const wishlistAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: wishlistScale.value }],
  }));

  // Check if product is in wishlist on mount or when wishlistItems/product changes
  useEffect(() => {
    const isProductInWishlist = wishlistItems.some(
      (item) => item.id === product.id.toString()
    );
    setIsInWishlist(isProductInWishlist);
  }, [wishlistItems, product.id]);

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handleWishlistToggle = async () => {
    if (isAddingWishlist || isRemovingWishlist) return;
  
    if (!product.id || !product.name || !product.price) {
      Toast.show({
        type: "error",
        text1: "Invalid Product",
        text2: "Product details are incomplete.",
        position: "top",
      });
      return;
    }
  
    setIsWishlistLoading(true);
    wishlistScale.value = withSpring(1.2, {}, () => {
      wishlistScale.value = withSpring(1);
    });
  
    try {
   
      if (!user?.id) {
        Toast.show({
          type: "error",
          text1: "Please Login",
          text2: "You need to login to manage wishlist.",
          position: "top",
        });
        return;
      }
  
      if (isInWishlist) {
        const response = await removeFromWishlistApi({
          user_id: parseInt(user?.id),
          product_id: parseInt(product.id.toString()),
        }).unwrap();
        console.log('remove from wishlist resp',response)
        if (response.success) {
          dispatch(removeFromWishlist(product.id.toString()));
          setIsInWishlist(false);
          Toast.show({
            type: "success",
            text1: "Removed from Wishlist",
            text2: `${product.name} removed successfully.`,
            position: "top",
          });
        }
      } else {
        const response = await addToWishlistApi({
          user_id: parseInt(user?.id),
          product_id: parseInt(product.id.toString()),
        }).unwrap();
        console.log('added from wishlist resp',response)
        if (response.success) {
          dispatch(addToWishlist({
            id: product.id.toString(),
            name: product.name,
            price: parseFloat(product.price.toString()),
            image: typeof product.image === "string" ? product.image : undefined,
          }));
          setIsInWishlist(true);
          Toast.show({
            type: "success",
            text1: "Added to Wishlist",
            text2: `${product.name} added successfully.`,
            position: "top",
          });
        }
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Wishlist Error",
        text2: response?.message || "Something went wrong. Please try again.",
        position: "top",
      });
    } finally {
      setIsWishlistLoading(false);
    }
  };
  

  const imageSource = product.image
    ? isRecentSearch
      ? product.image
      : { uri: product.image }
    : { uri: "https://via.placeholder.com/80" };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[styles.cardContainer, animatedStyle]}>
        <Image
          source={imageSource}
          style={styles.productImage}
          onError={(e) => console.log("Image load error:", e.nativeEvent.error)}
        />
        <View style={styles.productDetails}>
          <Text style={styles.productName} numberOfLines={2}>
            {product.name}
          </Text>
          <Text style={styles.productPrice}>
            ₹{parseFloat(product.price.toString()).toFixed(2)}
          </Text>
          {isInCart ? (
            <View style={styles.cartControls}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => onDecreaseQuantity(product.id.toString(), quantity)}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => onIncreaseQuantity(product.id.toString(), quantity)}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => onRemoveFromCart(product.id.toString(), product.name)}
              >
                <Ionicons name="trash" size={14} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <LinearGradient
              colors={["#FFD814", "#FF6D00"]}
              style={styles.addToCartButton}
            >
              <TouchableOpacity onPress={() => onAddToCart(product)}>
                <Text style={styles.addToCartText}>+ Add To Cart</Text>
              </TouchableOpacity>
            </LinearGradient>
          )}
        </View>
        <Animated.View style={[styles.wishlistButton, wishlistAnimatedStyle]}>
          <TouchableOpacity
            onPress={handleWishlistToggle}
            disabled={isWishlistLoading}
          >
            {isWishlistLoading ? (
              <ActivityIndicator size="small" color="#FF4444" />
            ) : (
              <Ionicons
                name={isInWishlist ? "heart" : "heart-outline"}
                size={24}
                color={isInWishlist ? "#FF4444" : "#666"}
              />
            )}
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    position: "relative",
  },
  productImage: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    borderRadius: 12,
    backgroundColor: "#F9F9F9",
  },
  productDetails: {
    marginLeft: 12,
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontFamily: "Roboto-Medium",
    color: "#1A2526",
    lineHeight: 22,
  },
  productPrice: {
    fontSize: 14,
    color: "#666",
    marginVertical: 6,
    fontFamily: "Roboto-Regular",
  },
  addToCartButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  addToCartText: {
    fontSize: 14,
    color: "#FFF",
    fontFamily: "Roboto-Bold",
  },
  cartControls: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  quantityButton: {
    backgroundColor: "#4CAF50",
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 4,
  },
  quantityButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Roboto-Bold",
  },
  quantityText: {
    fontSize: 14,
    color: "#333",
    fontFamily: "Roboto-Medium",
    marginHorizontal: 8,
  },
  deleteButton: {
    backgroundColor: "#FF4444",
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginLeft: 8,
  },
  wishlistButton: {
    position: "absolute",
    top: 12,
    right: 12,
  },
});

export default ProductCard;