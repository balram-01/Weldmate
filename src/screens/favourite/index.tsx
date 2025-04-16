import React, { useCallback, useEffect, useState } from "react";
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
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  withSpring,
  useAnimatedStyle,
} from "react-native-reanimated";
import LinearGradient from "react-native-linear-gradient";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  addToCart,
  updateQuantity,
  selectCartItems,
} from "../../redux/slices/cart/cartSlice";
import { useGetWishlistQuery, useAddToCartMutation, useRemoveFromWishlistMutation } from "../../redux/api/product";
import { productImages } from "../../images";
import { RootState } from "../../redux/store";

const { width } = Dimensions.get("window");

const FALLBACK_IMAGE = productImages.banner_welding_machine;

interface WishlistItemData {
  wishlist_id: string;
  user_id: string;
  added_at: string;
  product: {
    product_id: string;
    name: string;
    slug: string;
    short_description: string;
    description: string;
    brand: {
      brand_id: string;
      name: string;
      logo_url: string;
    };
    price: {
      mrp: number;
      sale_price: number;
      currency: string;
      discount_percent: number;
    };
    images: (string | null)[];
    stock_status: string;
    rating: {
      average: number;
      count: number;
    };
    is_in_wishlist: boolean;
    variants: any[];
    category: {
      category_id: string;
      name: string;
      slug: string;
    };
    tags: any[];
  };
}

// Memoized Wishlist Item Component
const WishlistItem = React.memo(
  ({
    item,
    handleRemoveFromWishlist,
    handleAddToCart,
    handleUpdateQuantity,
    cartQuantity,
    isRemoving,
  }: any) => {
    const scale = useSharedValue(1);
    const isInCart = cartQuantity > 0;

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    return (
      <Animated.View
        style={[styles.wishlistItem, animatedStyle]}
        entering={FadeInDown}
      >
        <Image
          source={
            item.product.images[0]
              ? { uri: String(item.product.images[0]) }
              : FALLBACK_IMAGE
          }
          style={styles.productImage}
          onError={() => console.log("Wishlist item image load error")}
        />
        <View style={styles.itemDetails}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.product.name}
          </Text>
          <Text style={styles.productPrice}>
            ₹{item.product.price.mrp.toFixed(2)}
          </Text>
          {isInCart ? (
            <View style={styles.cartControls}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() =>
                  handleUpdateQuantity(
                    item.product.product_id,
                    cartQuantity - 1,
                    item.product.name
                  )
                }
                onPressIn={() => (scale.value = withSpring(0.95))}
                onPressOut={() => (scale.value = withSpring(1))}
                disabled={isRemoving}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{cartQuantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() =>
                  handleUpdateQuantity(
                    item.product.product_id,
                    cartQuantity + 1,
                    item.product.name
                  )
                }
                onPressIn={() => (scale.value = withSpring(0.95))}
                onPressOut={() => (scale.value = withSpring(1))}
                disabled={isRemoving}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <LinearGradient
              colors={["#FFD814", "#FF6D00"]}
              style={styles.addToCartButton}
            >
              <TouchableOpacity
                onPress={() => handleAddToCart(item)}
                onPressIn={() => (scale.value = withSpring(0.95))}
                onPressOut={() => (scale.value = withSpring(1))}
                disabled={isRemoving}
              >
                <Text style={styles.addToCartText}>Add to Cart</Text>
              </TouchableOpacity>
            </LinearGradient>
          )}
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() =>
            handleRemoveFromWishlist(
              item.product.product_id,
              item.product.name,
              item.wishlist_id
            )
          }
          onPressIn={() => (scale.value = withSpring(0.95))}
          onPressOut={() => (scale.value = withSpring(1))}
          disabled={isRemoving}
        >
          {isRemoving ? (
            <ActivityIndicator size="small" color="#FF4444" />
          ) : (
            <Ionicons name="heart" size={24} color="#FF4444" />
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  }
);

// Memoized Empty Wishlist Component
const EmptyWishlist = React.memo(() => (
  <Animated.View style={styles.emptyContainer} entering={FadeInUp}>
    <Ionicons name="heart-outline" size={80} color="#666" />
    <Text style={styles.emptyText}>Your wishlist is empty</Text>
    <Text style={styles.emptySubText}>
      Add some products to your favourites!
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

const FavouritesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const [userId, setUserId] = useState<string | null>(null);
  const { data, isLoading, isError, refetch } = useGetWishlistQuery(parseInt(userId || "0"), {
    skip: !userId,
  });
  const [removeFromWishlistApi, { isLoading: isRemovingWishlist,error:removefromWishlistError }] = useRemoveFromWishlistMutation();
  const [addToCartApi, { isLoading: isAddingToCart,error:addtoCartError }] = useAddToCartMutation();
  console.log('removefromWishlistError',removefromWishlistError)
  const [removingItemId, setRemovingItemId] = useState<string | null>(null);
  const { user,} = useSelector((state: RootState) => state.user);
  useEffect(() => {
    const fetchUserId = async () => {
      try {
      if(user){
        setUserId(user?.id);
      }
  
      } catch (error) {
        console.error("Error fetching userId:", error);
        Toast.show({
          type: "error",
          text1: "Authentication Error",
          text2: "Please login again.",
          position: "top",
        });
      }
    };
    fetchUserId();
  }, [user]);

  useEffect(() => {
    if (isError) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load wishlist. Please try again.",
        position: "top",
      });
    }
  }, [isError]);

  const getCartQuantity = useCallback(
    (id: string) => {
      const cartItem = cartItems.find((item: any) => item.id === id);
      return cartItem ? cartItem.quantity : 0;
    },
    [cartItems]
  );

  const handleRemoveFromWishlist = useCallback(
    async (productId: string, name: string, wishlistId: string) => {
      if (!userId) {
        Toast.show({
          type: "error",
          text1: "Please Login",
          text2: "You need to login to manage wishlist.",
          position: "top",
        });
        return;
      }
  
      const numericProductId = parseInt(productId.replace("prod_", ""));
      if (!numericProductId || isNaN(numericProductId)) {
        Toast.show({
          type: "error",
          text1: "Invalid Product",
          text2: "Product ID is missing or invalid.",
          position: "top",
        });
        return;
      }
  
      setRemovingItemId(wishlistId);
      try {
        const response = await removeFromWishlistApi({
          user_id: parseInt(userId),
          product_id: numericProductId,
        }).unwrap();
  
        if (response.success) {
          Toast.show({
            type: "success",
            text1: "Removed from Wishlist",
            text2: `${name} removed successfully.`,
            position: "top",
          });
          refetch(); // Refresh wishlist
        } else {
          throw new Error(response.message || "Failed to remove item");
        }
      } catch (error: any) {
        console.error("Remove from wishlist error:", error);
        Toast.show({
          type: "error",
          text1: "Error",
          text2:
            error?.data?.message ||
            error.message ||
            "Failed to remove item from wishlist.",
          position: "top",
        });
      } finally {
        setRemovingItemId(null);
      }
    },
    [userId, removeFromWishlistApi, refetch]
  );
  
  // Update handleClearWishlist function
  const handleClearWishlist = useCallback(() => {
    Alert.alert(
      "Clear Wishlist",
      "Are you sure you want to remove all items from your wishlist?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            if (!userId) {
              Toast.show({
                type: "error",
                text1: "Please Login",
                text2: "You need to login to manage wishlist.",
                position: "top",
              });
              return;
            }
  
            if (!data?.wishlist?.length) {
              Toast.show({
                type: "info",
                text1: "Wishlist Empty",
                text2: "No items to clear.",
                position: "top",
              });
              return;
            }
  
            try {
              const promises = (data.wishlist || []).map((item: WishlistItemData) => {
                const numericProductId = parseInt(item.product.product_id.replace("prod_", ""));
                if (!numericProductId || isNaN(numericProductId)) {
                  throw new Error(`Invalid product ID for ${item.product.name}`);
                }
                return removeFromWishlistApi({
                  user_id: parseInt(userId),
                  product_id: numericProductId,
                }).unwrap();
              });
              await Promise.all(promises);
              Toast.show({
                type: "success",
                text1: "Wishlist Cleared",
                text2: "All items removed from wishlist.",
                position: "top",
              });
              refetch();
            } catch (error: any) {
              console.error("Clear wishlist error:", error);
              Toast.show({
                type: "error",
                text1: "Error",
                text2:
                  error?.data?.message ||
                  error.message ||
                  "Failed to clear wishlist. Please try again.",
                position: "top",
              });
            }
          },
        },
      ]
    );
  }, [userId, data, removeFromWishlistApi, refetch]);

  const handleAddToCart = useCallback(
    async (item: WishlistItemData) => {
      if (!userId) {
        Toast.show({
          type: "error",
          text1: "Please Login",
          text2: "You need to login to add items to cart.",
          position: "top",
        });
        return;
      }
  
      const productId = parseInt(item.product.product_id.replace("prod_", ""));
      if (!productId || isNaN(productId)) {
        Toast.show({
          type: "error",
          text1: "Invalid Product",
          text2: "Product ID is missing or invalid.",
          position: "top",
        });
        return;
      }
  
      try {
        const payload = {
          user_id: parseInt(userId),
          product_id: productId,
          quantity: 1,
        };
        console.log("Add to cart payload:", payload); // Debug log
  
        const response = await addToCartApi(payload).unwrap();
        console.log('add to cart response',response)
  
        if (response.success) {
          dispatch(
            addToCart({
              id: item.product.product_id,
              name: item.product.name,
              price: item.product.price.mrp,
              quantity: 1,
              image: item.product.images[0] || undefined,
            })
          );
          Toast.show({
            type: "success",
            text1: "Added to Cart",
            text2: `${item.product.name} added to cart.`,
            position: "top",
          });
        } else {
          throw new Error(response.message || "Failed to add item to cart");
        }
      } catch (error: any) {
        console.error("Add to cart error:", error);
        Toast.show({
          type: "error",
          text1: "Error",
          text2:
            error?.data?.message ||
            error.message ||
            "Failed to add item to cart. Please try again.",
          position: "top",
        });
      }
    },
    [userId, addToCartApi, dispatch]
  );

  const handleUpdateQuantity = useCallback(
    (id: string, newQuantity: number, name: string) => {
      if (newQuantity < 1) {
        dispatch(updateQuantity({ id, quantity: 0 }));
        Toast.show({
          type: "success",
          text1: "Removed from Cart",
          text2: `${name} removed from cart.`,
          position: "top",
        });
      } else {
        dispatch(updateQuantity({ id, quantity: newQuantity }));
        Toast.show({
          type: "success",
          text1: "Quantity Updated",
          text2: `${name} quantity set to ${newQuantity}.`,
          position: "top",
        });
      }
    },
    [dispatch]
  );

  if (isLoading || !userId) {
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
        <Text style={styles.headerTitle}>Your Wishlist</Text>
        {(data?.wishlist?.length || 0) > 0 && (
          <TouchableOpacity onPress={handleClearWishlist}>
            <Ionicons name="trash-outline" size={24} color="#FF4444" />
          </TouchableOpacity>
        )}
      </LinearGradient>

      {(data?.wishlist?.length || 0) === 0 ? (
        <EmptyWishlist />
      ) : (
        <FlatList
          data={data?.wishlist || []}
          keyExtractor={(item) => item.wishlist_id}
          renderItem={({ item }) => (
            <WishlistItem
              item={item}
              handleRemoveFromWishlist={handleRemoveFromWishlist}
              handleAddToCart={handleAddToCart}
              handleUpdateQuantity={handleUpdateQuantity}
              cartQuantity={getCartQuantity(item.product.product_id)}
              isRemoving={removingItemId === item.wishlist_id}
            />
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
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
  },
  wishlistItem: {
    flexDirection: "row",
    alignItems: "center",
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
  addToCartButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  addToCartText: {
    fontSize: 14,
    fontFamily: "Roboto-Bold",
    color: "#FFF",
  },
  cartControls: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
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
  removeButton: {
    padding: 8,
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
});

export default FavouritesScreen;