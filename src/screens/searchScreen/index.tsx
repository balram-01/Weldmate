import React, { useEffect, useState, useCallback, memo, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  ScrollView,
  StatusBar,
  Dimensions,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Dropdown } from "react-native-element-dropdown";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  selectCartItems,
} from "../../redux/slices/cart/cartSlice";
import Toast from "react-native-toast-message";
import { productImages } from "../../images";
import {
  ProductDetails,
  useSearchProductsQuery,
  SearchQueryParams,
  useAddToCartMutation,
  useRemoveFromCartMutation,
} from "../../redux/api/product";
import ScreenNames from "../../utils/screenNames";
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  withSpring,
  useAnimatedStyle,
} from "react-native-reanimated";
import LinearGradient from "react-native-linear-gradient";
import ProductCard from "../../component/cards/productCard";

const { width, height } = Dimensions.get("window");

interface RecentSearch {
  id: string;
  name: string;
  priceRange: string;
  image?: any;
}

interface HotKeyword {
  keyword: string;
  frequency: number;
}

interface Product {
  id: string | number;
  name: string;
  price: number | string;
  quantity?: number;
  image?: string;
}

const FALLBACK_IMAGE = productImages.cutter1;

const initialHotKeywords: HotKeyword[] = [];

const sortOptions = [
  { label: "Default", value: "" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
];



// Keyword Chip Component
const KeywordChip = memo(
  ({
    keyword,
    frequency,
    onPress,
  }: {
    keyword: string;
    frequency: number;
    onPress: () => void;
  }) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    return (
      <TouchableOpacity
        onPress={() => {
          onPress();
          scale.value = withSpring(
            1.1,
            {},
            () => (scale.value = withSpring(1))
          );
        }}
      >
        <Animated.View style={[styles.keywordButton, animatedStyle]}>
          <Text style={styles.keywordText}>{keyword}</Text>
          {frequency > 0 && (
            <Text style={styles.frequencyText}>({frequency})</Text>
          )}
        </Animated.View>
      </TouchableOpacity>
    );
  }
);

const SearchScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useDispatch();
    const { user,  } = useSelector((state: RootState) => state.user);
  const cartItems = useSelector(selectCartItems);
  const [searchText, setSearchText] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [isFirstSearch, setIsFirstSearch] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [allResults, setAllResults] = useState<ProductDetails[]>([]);
  
  const [hasMore, setHasMore] = useState<boolean>(true);
// Add to existing state declarations
const [isAddingToCart, setIsAddingToCart] = useState<string | null>(null);
const [isRemovingFromCart, setIsRemovingFromCart] = useState<string | null>(null);
// Add API hooks
const [addToCartApi, { isLoading: isAdding }] = useAddToCartMutation();
const [removeFromCartApi, { isLoading: isRemoving }] = useRemoveFromCartMutation();
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [hotKeywords, setHotKeywords] = useState<HotKeyword[]>(
    initialHotKeywords
  );

  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false);
  const [category, setCategory] = useState<string>("");
  const [brand, setBrand] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");
  const limit = 10;

  useEffect(() => {
    if (isFirstSearch && searchText) {
      setDebouncedSearch(searchText);
      setIsFirstSearch(false);
      setPage(1);
      setAllResults([]);
      setHasMore(true);
    } else {
      const timer = setTimeout(() => {
        setDebouncedSearch(searchText);
        setPage(1);
        setAllResults([]);
        setHasMore(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [searchText, category, brand, minPrice, maxPrice, sortBy, isFirstSearch]);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedSearches = await AsyncStorage.getItem("recentSearches");
        if (savedSearches) setRecentSearches(JSON.parse(savedSearches));
        else setRecentSearches([]);

        const savedHotKeywords = await AsyncStorage.getItem("hotKeywords");
        if (savedHotKeywords) setHotKeywords(JSON.parse(savedHotKeywords));
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const saveData = async () => {
      try {
        if (recentSearches.length > 0)
          await AsyncStorage.setItem(
            "recentSearches",
            JSON.stringify(recentSearches)
          );
        if (hotKeywords.length > 0)
          await AsyncStorage.setItem(
            "hotKeywords",
            JSON.stringify(hotKeywords)
          );
      } catch (error) {
        console.error("Error saving data:", error);
      }
    };
    saveData();
  }, [recentSearches, hotKeywords]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
      setPage(1);
      setAllResults([]);
      setHasMore(true);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchText, category, brand, minPrice, maxPrice, sortBy]);

  const searchParams = useMemo(
    () => ({
      query: isFirstSearch && searchText ? searchText : debouncedSearch,
      category: category || undefined,
      brand: brand || undefined,
      min_price: minPrice ? parseFloat(minPrice) : undefined,
      max_price: maxPrice ? parseFloat(maxPrice) : undefined,
      sort_by: sortBy || undefined,
      limit,
      page,
    }),
    [isFirstSearch, searchText, debouncedSearch, category, brand, minPrice, maxPrice, sortBy, page]
  );

  const { data: searchResults, isLoading, isError,refetch } = useSearchProductsQuery(searchParams); 

  useEffect(() => {
    if (searchResults?.success && debouncedSearch) {
      if (Array.isArray(searchResults.data)) {
        setAllResults([]);
        setHasMore(false);
      } else {
        const newResults = searchResults.data.data || [];
        setAllResults((prev) =>
          page === 1 ? newResults : [...prev, ...newResults]
        );
        setHasMore(page < searchResults.data.last_page);
      }
    } else if (!debouncedSearch) {
      setAllResults([]);
      setHasMore(true);
    }
  }, [searchResults, page, debouncedSearch]);
  useEffect(() => {
    if (searchResults?.success && (debouncedSearch || (isFirstSearch && searchText))) {
      const newResults = searchResults.data?.data || [];
      setAllResults((prev) => (page === 1 ? newResults : [...prev, ...newResults]));
      setHasMore(page < (searchResults.data?.last_page || 1));
    } else {
      setAllResults([]);
      setHasMore(false);
    }
  }, [searchResults, page, debouncedSearch, isFirstSearch, searchText]);
  


  const handleAddToRecent = (item: ProductDetails) => {
    const newSearch: RecentSearch = {
      id: `${item.id}-${Date.now()}`,
      name: item.name,
      priceRange: `₹${parseFloat(item.price.toString()).toFixed(2)}`,
      image: item.brand?.logo ? { uri: item.brand.logo } : FALLBACK_IMAGE,
    };

    setRecentSearches((prev) => {
      const filtered = prev.filter((search) => search.name !== newSearch.name);
      const updatedSearches = [newSearch, ...filtered].slice(0, 5);
      updateHotKeywordsFromSearch(newSearch.name);
      return updatedSearches;
    });
  };

  const updateHotKeywordsFromSearch = (searchTerm: string) => {
    setHotKeywords((prev) => {
      const existing = prev.find(
        (item) => item.keyword.toLowerCase() === searchTerm.toLowerCase()
      );
      if (existing) {
        return prev
          .map((item) =>
            item.keyword.toLowerCase() === searchTerm.toLowerCase()
              ? { ...item, frequency: item.frequency + 1 }
              : item
          )
          .sort((a, b) => b.frequency - a.frequency)
          .slice(0, 9);
      } else {
        const newKeyword = { keyword: searchTerm, frequency: 1 };
        return [...prev, newKeyword]
          .sort((a, b) => b.frequency - a.frequency)
          .slice(0, 9);
      }
    });
  };

  const loadMoreResults = useCallback(() => {
    if (!isLoading && hasMore) setPage((prev) => prev + 1);
  }, [isLoading, hasMore]);
  const handleKeywordPress = (keyword: string) => {
    setSearchText(keyword);
    setHotKeywords((prev) => {
      const updated = prev.map((item) =>
        item.keyword === keyword
          ? { ...item, frequency: item.frequency + 1 }
          : item
      );
      return updated.sort((a, b) => b.frequency - a.frequency).slice(0, 9);
    });
  };

  const clearFilters = () => {
    setCategory("");
    setBrand("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("");
    setPage(1);
    setAllResults([]);
    setHasMore(true);
  };

// Update handleAddToCart function
const handleAddToCart = async (product: Product) => {
  if (!product.id || !product.name || !product.price) {
    Toast.show({
      type: "error",
      text1: "Invalid Product",
      text2: "Product details are incomplete.",
      position: "top",
    });
    return;
  }

  setIsAddingToCart(product.id.toString());
  try {
   
    if (!user?.id) {
      Toast.show({
        type: "error",
        text1: "Please Login",
        text2: "You need to login to add items to cart.",
        position: "top",
      });
      return;
    }

    const response = await addToCartApi({
      user_id: parseInt(user?.id),
      product_id: parseInt(product.id.toString()),
      quantity: 1,
    }).unwrap();
console.log("add to cart Response",response)
    if (response.success) {
      dispatch(addToCart({
        id: product.id.toString(),
        name: product.name,
        price: parseFloat(product.price.toString()),
        quantity: 1,
        image: product.image,
      }));
      Toast.show({
        type: "success",
        text1: "Added to Cart",
        text2: `${product.name} added successfully.`,
        position: "top",
      });
    }
  } catch (error) {
    Toast.show({
      type: "error",
      text1: "Failed to Add",
      text2: "Could not add item to cart. Please try again.",
      position: "top",
    });
  } finally {
    setIsAddingToCart(null);
  }
};

  const handleDecreaseQuantity = (id: string, currentQuantity: number) => {
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
  };

  const handleIncreaseQuantity = (id: string, currentQuantity: number) => {
    dispatch(updateQuantity({ id, quantity: currentQuantity + 1 }));
  };

 // Update handleRemoveFromCart function
const handleRemoveFromCart = async (id: string, name: string) => {
  if (!id) {
    Toast.show({
      type: "error",
      text1: "Invalid Item",
      text2: "Item ID is missing.",
      position: "top",
    });
    return;
  }

  setIsRemovingFromCart(id);
  try {
    const response = await removeFromCartApi(parseInt(id)).unwrap();
    if (response.success) {
      dispatch(removeFromCart(id));
      Toast.show({
        type: "success",
        text1: "Removed from Cart",
        text2: `${name} removed successfully.`,
        position: "top",
      });
    }
  } catch (error) {
    Toast.show({
      type: "error",
      text1: "Failed to Remove",
      text2: "Could not remove item from cart. Please try again.",
      position: "top",
    });
  } finally {
    setIsRemovingFromCart(null);
  }
};

  const getCartItemQuantity = (id: string | number): number => {
    const cartItem = cartItems.find((item) => item.id === id.toString());
    return cartItem ? cartItem.quantity : 0;
  };

  const gotoProductDetails = (item: ProductDetails) => {
    navigation.navigate(ScreenNames.PRODUCT_DETAILS, { item });
  };

  const renderFooter = () => {
    if (!debouncedSearch || !isLoading || page === 1) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#FF6D00" />
      </View>
    );
  };

  const renderFilterChips = useCallback(() => {
    const activeFilters: { label: string; onRemove: () => void }[] = [];
    if (category) {
      activeFilters.push({
        label: `Category: ${category}`,
        onRemove: () => setCategory(""),
      });
    }
    if (brand) {
      activeFilters.push({
        label: `Brand: ${brand}`,
        onRemove: () => setBrand(""),
      });
    }
    if (minPrice) {
      activeFilters.push({
        label: `Min: ₹${minPrice}`,
        onRemove: () => setMinPrice(""),
      });
    }
    if (maxPrice) {
      activeFilters.push({
        label: `Max: ₹${maxPrice}`,
        onRemove: () => setMaxPrice(""),
      });
    }
    if (sortBy) {
      const sortLabel =
        sortOptions.find((opt) => opt.value === sortBy)?.label || sortBy;
      activeFilters.push({
        label: `Sort: ${sortLabel}`,
        onRemove: () => setSortBy(""),
      });
    }
    return activeFilters;
  }, [category, brand, minPrice, maxPrice, sortBy]);

  const renderFilterModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <Animated.View
          style={styles.modalOverlay}
          entering={FadeInUp.duration(300)}
        >
          <Animated.View
            style={styles.modalContent}
            entering={FadeInUp.duration(300).delay(100)}
          >
            <LinearGradient
              colors={["#1A2526", "#2E3B3C"]}
              style={styles.modalHeader}
            >
              <Text style={styles.modalTitle}>Filter Products</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <Ionicons name="close" size={24} color="#FFF" />
              </TouchableOpacity>
            </LinearGradient>
            <ScrollView
              contentContainerStyle={styles.modalScroll}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.filterLabel}>Category</Text>
              <TextInput
                style={styles.filterInput}
                value={category}
                onChangeText={setCategory}
                placeholder="e.g., Cooling Units"
                placeholderTextColor="#999"
              />

              <Text style={styles.filterLabel}>Brand</Text>
              <TextInput
                style={styles.filterInput}
                value={brand}
                onChangeText={setBrand}
                placeholder="e.g., Apple"
                placeholderTextColor="#999"
              />

              <Text style={styles.filterLabel}>Price Range</Text>
              <View style={styles.priceRangeContainer}>
                <TextInput
                  style={[styles.filterInput, styles.priceInput]}
                  value={minPrice}
                  onChangeText={(text) => {
                    if (!text || /^\d*\.?\d*$/.test(text)) setMinPrice(text);
                  }}
                  placeholder="Min (₹)"
                  keyboardType="numeric"
                  placeholderTextColor="#999"
                />
                <Text style={styles.priceRangeDash}>–</Text>
                <TextInput
                  style={[styles.filterInput, styles.priceInput]}
                  value={maxPrice}
                  onChangeText={(text) => {
                    if (!text || /^\d*\.?\d*$/.test(text)) setMaxPrice(text);
                  }}
                  placeholder="Max (₹)"
                  keyboardType="numeric"
                  placeholderTextColor="#999"
                />
              </View>
              {minPrice &&
                maxPrice &&
                parseFloat(minPrice) > parseFloat(maxPrice) && (
                  <Text style={styles.errorText}>
                    Min price must be less than max price
                  </Text>
                )}

              <Text style={styles.filterLabel}>Sort By</Text>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                data={sortOptions}
                search={false}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Select sorting option"
                value={sortBy}
                onChange={(item) => setSortBy(item.value)}
                renderItem={(item) => (
                  <View style={styles.dropdownItem}>
                    <Text style={styles.dropdownItemText}>{item.label}</Text>
                  </View>
                )}
              />
            </ScrollView>
            <View style={styles.modalButtons}>
              <LinearGradient
                colors={["#B0B0B0", "#808080"]}
                style={styles.modalButton}
              >
                <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </LinearGradient>
              <LinearGradient
                colors={["#FFD814", "#FF6D00"]}
                style={styles.modalButton}
              >
                <TouchableOpacity
                  onPress={() => {
                    if (
                      minPrice &&
                      maxPrice &&
                      parseFloat(minPrice) > parseFloat(maxPrice)
                    )
                      return;
                    setPage(1);
                    setAllResults([]);
                    setHasMore(true);
                    setFilterModalVisible(false);
                  }}
                >
                  <Text style={styles.modalButtonText}>Apply</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <LinearGradient colors={["#1A2526", "#2E3B3C"]} style={styles.searchBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Products..."
          value={searchText}
          onChangeText={setSearchText}
          autoFocus={true}
          returnKeyType="search"
          onSubmitEditing={() => refetch()}
          placeholderTextColor="#FFF"
        />
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <Ionicons
            name="filter"
            size={24}
            color={
              category || brand || minPrice || maxPrice || sortBy
                ? "#FFD814"
                : "#FFF"
            }
          />
        </TouchableOpacity>
        {isLoading && page === 1 && (
          <ActivityIndicator size="small" color="#FFD814" />
        )}
      </LinearGradient>

      {debouncedSearch && (
        <View style={styles.filterChipsContainer}>
          {renderFilterChips().map((filter, index) => (
            <LinearGradient
              key={`${filter.label}-${index}`} // Use a more unique key
              colors={["#FFD814", "#FF6D00"]}
              style={styles.chipGradient}
            >
              <View style={styles.filterChip}>
                <Text style={styles.filterChipText}>{filter.label}</Text>
                <TouchableOpacity
                  style={styles.removeChip}
                  onPress={filter.onRemove}
                >
                  <Ionicons name="close" size={16} color="#FFF" />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          ))}
          {renderFilterChips().length > 0 && (
            <LinearGradient
              colors={["#B0B0B0", "#808080"]}
              style={styles.clearAllGradient}
            >
              <TouchableOpacity
                style={styles.clearAllButton}
                onPress={clearFilters}
              >
                <Text style={styles.clearAllText}>Clear All</Text>
              </TouchableOpacity>
            </LinearGradient>
          )}
        </View>
      )}
      {!debouncedSearch ? (
        <ScrollView>
          <Animated.Text style={styles.sectionTitle} entering={FadeInDown}>
            Hot Keywords
          </Animated.Text>
          <View style={styles.keywordContainer}>
            {hotKeywords.map((item, index) => (
              <KeywordChip
                key={index}
                keyword={item.keyword}
                frequency={item.frequency}
                onPress={() => handleKeywordPress(item.keyword)}
              />
            ))}
          </View>

          <Animated.Text
            style={styles.sectionTitle}
            entering={FadeInDown.delay(100)}
          >
            Recent Searches
          </Animated.Text>
          <FlatList
            data={recentSearches}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              console.log("Rendering recent search item:", item);
              if (!item.id || !item.name || !item.priceRange) {
                console.warn("Skipping invalid recent search item:", item);
                return null;
              }
              const price = parseFloat(
                item.priceRange.replace("₹", "").replace(",", "")
              );
              if (isNaN(price)) {
                console.warn("Invalid price for recent search:", item);
                return null;
              }
              const productId = item.id.includes("-") ? item.id.split("-")[0] : item.id;
              return (
                <ProductCard
                  product={{
                    id: productId,
                    name: item.name,
                    price,
                    image: item.image,
                  }}
                  isRecentSearch={true}
                  onPress={() =>
                    gotoProductDetails({
                      id: productId,
                      name: item.name,
                      price,
                    })
                  }
                  onAddToCart={handleAddToCart}
                  onDecreaseQuantity={handleDecreaseQuantity}
                  onIncreaseQuantity={handleIncreaseQuantity}
                  onRemoveFromCart={handleRemoveFromCart}
                  getCartItemQuantity={getCartItemQuantity}
                  isLoading={isAddingToCart === productId.toString() || isRemovingFromCart === productId.toString()}
                />
              );
            }}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No recent searches</Text>
            }
          />
        </ScrollView>
      ) : (
        <FlatList
          data={allResults}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item }) =>(
            <ProductCard
              product={{
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.category?.image_url,
              }}
              onPress={() => {
                handleAddToRecent(item);
                gotoProductDetails(item);
              }}
              onAddToCart={handleAddToCart}
              onDecreaseQuantity={handleDecreaseQuantity}
              onIncreaseQuantity={handleIncreaseQuantity}
              onRemoveFromCart={handleRemoveFromCart}
              getCartItemQuantity={getCartItemQuantity}
              isLoading={isAddingToCart === item.id.toString() || isRemovingFromCart === item.id.toString()}
            />
          )}
          onEndReached={loadMoreResults}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            isLoading && page === 1 ? (
              <ActivityIndicator size="large" color="#FF6D00" />
            ) : isError ? (
              <Text style={styles.errorText}>
                Error loading results. Try again.
              </Text>
            ) : (
              <Text style={styles.emptyText}>
                No products found for the selected filters
              </Text>
            )
          }
          keyboardShouldPersistTaps="handled"
        />
      )}

      <View> {renderFilterModal()}</View>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#FFF",
    fontFamily: "Roboto-Regular",
    paddingVertical: 8,
  },
  filterButton: {
    marginLeft: 12,
    padding: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Roboto-Bold",
    color: "#1A2526",
    marginVertical: 12,
  },
  keywordContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  keywordButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F4F5",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  keywordText: {
    fontSize: 14,
    color: "#333",
    fontFamily: "Roboto-Medium",
  },
  frequencyText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 6,
    fontFamily: "Roboto-Regular",
  },
  recentItem: {
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
  emptyText: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
    marginTop: 24,
    fontFamily: "Roboto-Regular",
  },
  errorText: {
    textAlign: "center",
    color: "#FF4444",
    fontSize: 16,
    marginTop: 24,
    fontFamily: "Roboto-Regular",
  },
  footerLoader: {
    paddingVertical: 24,
    alignItems: "center",
  },
  filterChipsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    flexWrap: "wrap",
  },
  chipGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 12,
    marginBottom: 8,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
  },
  filterChipText: {
    color: "#FFF",
    fontSize: 14,
    fontFamily: "Roboto-Medium",
  },
  removeChip: {
    marginLeft: 8,
  },
  clearAllGradient: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 8,
  },
  clearAllButton: {
    padding: 8,
  },
  clearAllText: {
    color: "#FFF",
    fontSize: 14,
    fontFamily: "Roboto-Bold",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end", // Modal slides from bottom
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.8, // Limit height to 80% of screen
    width: width, // Full width
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 }, // Shadow at top
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "Roboto-Bold",
    color: "#FFF",
  },
  modalScroll: {
    padding: 20,
    paddingBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontFamily: "Roboto-Medium",
    color: "#1A2526",
    marginTop: 16,
    marginBottom: 8,
  },
  filterInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#F9F9F9",
    color: "#333",
    fontFamily: "Roboto-Regular",
  },
  priceRangeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  priceInput: {
    flex: 1,
    marginHorizontal: 8,
  },
  priceRangeDash: {
    fontSize: 18,
    color: "#666",
    fontFamily: "Roboto-Regular",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    backgroundColor: "#FFF",
  },
  modalButton: {
    flex: 1,
    borderRadius: 12,
    marginHorizontal: 8,
    overflow: "hidden",
  },
  modalButtonText: {
    fontSize: 16,
    color: "#FFF",
    fontFamily: "Roboto-Bold",
    textAlign: "center",
    paddingVertical: 12,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#F9F9F9",
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#999",
    fontFamily: "Roboto-Regular",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Roboto-Regular",
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    fontFamily: "Roboto-Regular",
  },
  dropdownItem: {
    padding: 12,
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Roboto-Regular",
  },
});

export default SearchScreen;
