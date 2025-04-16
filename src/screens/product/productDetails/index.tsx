import React, { useState, useEffect, useMemo, memo } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import Animated, {
  FadeInDown,
  FadeInUp,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import Carousel, { ICarouselInstance, Pagination } from 'react-native-reanimated-carousel';
import Toast from 'react-native-toast-message';
import { productImages } from '../../../images'; // Adjust path as needed
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, selectCartItems } from '../../../redux/slices/cart/cartSlice'; // Adjust path
import { useGetProductDetailsQuery } from '../../../redux/api/product';
import { useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import ScreenNames from '../../../utils/screenNames';

const { width, height } = Dimensions.get('window');

// Simulated API response (unchanged)
const dummyFallbackData = {
  originalPrice: '1099.99',
  discount: '9%',
  rating: 4.5,
  reviewCount: 1500,
  stock: 'in stock',
  images: [
    { image: productImages.banner_welding_machine },
    { image: productImages.banner_welding_machine },
    { image: productImages.banner_welding_machine },
  ],
  variants: { size: ['S', 'M', 'L'], color: ['Red', 'Black', 'Blue'] },
  delivery: { date: 'Apr 18, 2025', pincode: '560001', fast: true },
  seller: 'Apple Store',
  warranty: '1 Year',
  highlights: ['A16 Bionic Chip', '6.1-inch Super Retina XDR Display', 'USB-C Connector'],
};

// Error Boundary (unchanged)
class ErrorBoundary extends React.Component {
  state = { error: null };
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Something went wrong</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

// Enhanced BannerCarousel Component
const BannerCarousel = memo(({ bannerData, width }) => {
  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue(0);

  if (!bannerData || bannerData.length === 0) {
    return (
      <View style={styles.bannerContainer}>
        <Text style={styles.errorText}>No images available</Text>
      </View>
    );
  }

  const onPressPagination = (index) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  // Parallax effect for images
  const renderItem = ({ item, index, animationValue }) => {
    const animatedStyle = useAnimatedStyle(() => {
      const translateX = interpolate(
        animationValue.value,
        [-1, 0, 1],
        [-width * 0.1, 0, width * 0.1]
      );
      return {
        transform: [{ translateX }],
      };
    });

    return (
      <Animated.View style={[styles.bannerImageContainer, animatedStyle]}>
        <Image
          source={item.image}
          style={styles.bannerImage}
          accessibilityLabel="Product image"
          resizeMode="cover"
          onError={(e) => console.log('Image error:', e.nativeEvent.error)}
        />
      </Animated.View>
    );
  };

  return (
    <View style={styles.bannerContainer}>
      <Carousel
        ref={ref}
        loop
        width={width}
        height={height * 0.4}
        autoPlay
        autoPlayInterval={3000}
        data={bannerData}
        onProgressChange={(_, absoluteProgress) => {
          progress.value = absoluteProgress;
        }}
        scrollAnimationDuration={800}
        renderItem={renderItem}
      />
      <Pagination.Basic
        progress={progress}
        data={bannerData}
        dotStyle={styles.dot}
        containerStyle={styles.paginationContainer}
        onPress={onPressPagination}
        activeDotStyle={styles.activeDot}
        accessibilityRole="button"
        accessibilityLabel="Carousel pagination"
      />
    </View>
  );
});

// Variant Chip Component
const VariantChip = ({ label, isSelected, onPress }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: isSelected ? '#FF6D00' : '#F0F4F5',
    borderColor: isSelected ? '#FF6D00' : '#E0E0E0',
  }));

  const textStyle = useAnimatedStyle(() => ({
    color: isSelected ? '#FFF' : '#333',
  }));

  return (
    <TouchableOpacity
      onPress={() => {
        onPress();
        scale.value = withSpring(1.1, {}, () => {
          scale.value = withSpring(1);
        });
      }}
      accessibilityRole="button"
      accessibilityLabel={`Select ${label}`}
    >
      <Animated.View style={[styles.chip, animatedStyle]}>
        <Animated.Text style={[styles.chipText, textStyle]}>{label}</Animated.Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

// Stock Progress Bar
const StockProgressBar = ({ stock }) => {
  const progress = useSharedValue(stock > 0 ? stock / 10 : 0);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
    backgroundColor: stock > 5 ? '#28a745' : stock > 2 ? '#FFA500' : '#D32F2F',
  }));

  useEffect(() => {
    progress.value = withTiming(stock / 10, { duration: 1000 });
  }, [stock]);

  return (
    <View style={styles.stockContainer}>
      <Text style={styles.stockText}>
        {stock > 0 ? `${stock} left in stock` : 'Out of stock'}
      </Text>
      <View style={styles.progressBar}>
        <Animated.View style={[styles.progressFill, animatedStyle]} />
      </View>
    </View>
  );
};

// ProductDetails Component
const ProductDetails = ({ navigation }) => {
  const [pincode, setPincode] = useState('560001');
  const [pincodeError, setPincodeError] = useState('');
  const [selectedVariant, setSelectedVariant] = useState({ size: 'M', color: 'Red' });
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const route = useRoute();
  const { item: productData } = route.params;
  const { data: apiProductData, isError, error } = useGetProductDetailsQuery(productData?.id);
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);

  // Memoized product data to prevent re-computation
  const product = useMemo(
    () => ({
      id: apiProductData?.data?.id.toString(),
      name: apiProductData?.data?.name,
      brand: {
        name: apiProductData?.data?.brand.name,
        logo: dummyFallbackData.images[0].image,
      },
      price: apiProductData?.data?.price,
      originalPrice: dummyFallbackData.originalPrice,
      discount: dummyFallbackData.discount,
      rating: dummyFallbackData.rating,
      reviewCount: dummyFallbackData.reviewCount,
      stock: apiProductData?.data?.stock || 0,
      description: apiProductData?.data?.description,
      images: dummyFallbackData.images,
      variants: dummyFallbackData.variants,
      delivery: dummyFallbackData.delivery,
      seller: dummyFallbackData.seller,
      warranty: dummyFallbackData.warranty,
      highlights: dummyFallbackData.highlights,
    }),
    [apiProductData]
  );

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const validatePincode = (value) => {
    const regex = /^\d{6}$/;
    if (!regex.test(value)) {
      setPincodeError('Please enter a valid 6-digit pincode');
      return false;
    }
    setPincodeError('');
    return true;
  };

  const handlePincodeChange = (value) => {
    setPincode(value);
    validatePincode(value);
  };

  const handleAddToCart = () => {
    setIsAddingToCart(true);
    const cartProduct = {
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image: product.images[0]?.image,
      brand: {
        logo: product.brand.logo,
      },
    };

    setTimeout(() => {
      dispatch(addToCart(cartProduct));
      setIsAddingToCart(false);
      Toast.show({
        type: 'success',
        text1: 'Added to Cart',
        text2: `${product.name} has been added to your cart.`,
        position: 'top',
      });
    }, 1000);
  };

  const buttonScale = useSharedValue(1);
  const handleButtonPressIn = () => {
    buttonScale.value = withSpring(0.95);
  };
  const handleButtonPressOut = () => {
    buttonScale.value = withSpring(1);
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const renderOffer = ({ item }) => (
    <Animated.View style={styles.offerItem} entering={FadeInDown.delay(200)}>
      <LinearGradient
        colors={['#FFD814', '#FF6D00']}
        style={styles.offerGradient}
      >
        <Text style={styles.offerText}>{item}</Text>
      </LinearGradient>
    </Animated.View>
  );

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (isLoading) {
    return (
      <LinearGradient colors={['#1A2526', '#2E3B3C']} style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#FF6D00" />
      </LinearGradient>
    );
  }

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#1A2526" />
        <Toast />
        <LinearGradient colors={['#1A2526', '#2E3B3C']} style={styles.topBar}>
          <TouchableOpacity
            accessibilityLabel="Go back"
            accessibilityRole="button"
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={28} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.replace(ScreenNames.SEARCH_SCREEN)}
            style={styles.searchBar}
            accessibilityRole="search"
          >
            <Text style={styles.searchPlaceholder}>Search welmdate.in</Text>
          </TouchableOpacity>
          <View style={styles.iconGroup}>
            <TouchableOpacity
              onPress={() => navigation.navigate(ScreenNames.HOME, { screen: ScreenNames.CART_SCREEN })}
              accessibilityLabel={`Cart with ${totalCartItems} items`}
              accessibilityRole="button"
            >
              <Icon name="cart" size={28} color="#FFF" />
              {totalCartItems > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{totalCartItems}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityLabel="Share product"
              accessibilityRole="button"
            >
              <Icon name="share-social" size={28} color="#FFF" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInUp}>
            <BannerCarousel bannerData={product.images} width={width} />
          </Animated.View>
          <Animated.View style={styles.titleSection} entering={FadeInDown.delay(100)}>
            <Text style={styles.productTitle}>{product.name}</Text>
            <View style={styles.ratingRow}>
              <Icon name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>{product.rating} ★★★★☆</Text>
              <TouchableOpacity accessibilityRole="button">
                <Text style={styles.reviewCount}>
                  {product.reviewCount.toLocaleString()} reviews
                </Text>
              </TouchableOpacity>
            </View>
            <LinearGradient colors={['#FFD814', '#FF6D00']} style={styles.tag}>
              <Text style={styles.tagText}>welmdate's Choice</Text>
            </LinearGradient>
          </Animated.View>
          <Animated.View style={styles.pricing} entering={FadeInDown.delay(200)}>
            <Text style={styles.currentPrice}>₹{product.price}</Text>
            <View style={styles.priceDetails}>
              <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
              <Text style={styles.discount}>{product.discount} off</Text>
            </View>
            <TouchableOpacity accessibilityRole="button">
              <Text style={styles.emi}>EMI starts at ₹50/month</Text>
            </TouchableOpacity>
            <Text style={styles.tax}>Inclusive of all taxes</Text>
            <StockProgressBar stock={product.stock} />
          </Animated.View>
          <Animated.View style={styles.variants} entering={FadeInDown.delay(300)}>
            <Text style={styles.sectionTitle}>Select Variant</Text>
            <View style={styles.variantGroup}>
              <Text style={styles.variantLabel}>Size:</Text>
              <View style={styles.chipRow}>
                {product.variants.size.map((size) => (
                  <VariantChip
                    key={size}
                    label={size}
                    isSelected={selectedVariant.size === size}
                    onPress={() => setSelectedVariant({ ...selectedVariant, size })}
                  />
                ))}
              </View>
            </View>
            <View style={styles.variantGroup}>
              <Text style={styles.variantLabel}>Color:</Text>
              <View style={styles.chipRow}>
                {product.variants.color.map((color) => (
                  <VariantChip
                    key={color}
                    label={color}
                    isSelected={selectedVariant.color === color}
                    onPress={() => setSelectedVariant({ ...selectedVariant, color })}
                  />
                ))}
              </View>
            </View>
          </Animated.View>
          <Animated.View style={styles.delivery} entering={FadeInDown.delay(400)}>
            <Text style={styles.sectionTitle}>Delivery Details</Text>
            <Text style={styles.inputLabel}>Pincode</Text>
            <TextInput
              style={[styles.input, pincodeError ? styles.inputError : {}]}
              value={pincode}
              onChangeText={handlePincodeChange}
              keyboardType="numeric"
              maxLength={6}
              placeholder="Enter 6-digit pincode"
              placeholderTextColor="#999"
              accessibilityLabel="Pincode input"
              accessibilityRole="text"
            />
            {pincodeError ? (
              <Text style={styles.errorText}>{pincodeError}</Text>
            ) : (
              <Text style={styles.helperText}>Check delivery availability</Text>
            )}
            <Text style={styles.deliveryText}>
              Delivery by {product.delivery.date}
            </Text>
            {product.delivery.fast && (
              <LinearGradient colors={['#28a745', '#4CAF50']} style={styles.fastBadge}>
                <Text style={styles.fastBadgeText}>Fast Delivery</Text>
              </LinearGradient>
            )}
            <Text style={styles.deliveryText}>Free Shipping</Text>
          </Animated.View>
          <Animated.View style={styles.offers} entering={FadeInDown.delay(500)}>
            <Text style={styles.sectionTitle}>Available Offers</Text>
            <FlatList
              data={['10% Bank Offer', '₹50 Cashback', 'No Cost EMI']}
              renderItem={renderOffer}
              keyExtractor={(item) => item}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </Animated.View>
          <Animated.View style={styles.details} entering={FadeInDown.delay(600)}>
            <Text style={styles.sectionTitle}>Highlights</Text>
            {product.highlights.map((highlight, index) => (
              <View key={index} style={styles.highlightItem}>
                <Icon name="checkmark-circle" size={20} color="#28a745" />
                <Text style={styles.highlight}>{highlight}</Text>
              </View>
            ))}
          </Animated.View>
          <Animated.View style={styles.description} entering={FadeInDown.delay(700)}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{product.description}</Text>
          </Animated.View>
        </ScrollView>
        <Animated.View style={styles.stickyButtons} entering={FadeInUp}>
          <LinearGradient colors={['#FFD814', '#FF6D00']} style={styles.stickyButton}>
            <TouchableOpacity
              style={[styles.addToCart, isAddingToCart && styles.disabledButton]}
              onPress={handleAddToCart}
              onPressIn={handleButtonPressIn}
              onPressOut={handleButtonPressOut}
              disabled={isAddingToCart}
              accessibilityLabel="Add to cart"
              accessibilityRole="button"
            >
              <Animated.View style={buttonAnimatedStyle}>
                {isAddingToCart ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={styles.buttonText}>Add to Cart</Text>
                )}
              </Animated.View>
            </TouchableOpacity>
          </LinearGradient>
          <LinearGradient colors={['#FF6D00', '#FF4500']} style={styles.stickyButton}>
            <TouchableOpacity
              style={styles.buyNow}
              onPressIn={handleButtonPressIn}
              onPressOut={handleButtonPressOut}
              accessibilityLabel="Buy now"
              accessibilityRole="button"
            >
              <Animated.View style={buttonAnimatedStyle}>
                <Text style={styles.buttonText}>Buy Now</Text>
              </Animated.View>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
      </View>
    </ErrorBoundary>
  );
};

// Updated Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  scrollContent: {
    paddingBottom: 120, // Space for sticky buttons
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 100,
  },
  searchBar: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 12,
    backdropFilter: 'blur(10px)', // Glassmorphism effect (if supported)
  },
  searchPlaceholder: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    opacity: 0.8,
  },
  iconGroup: {
    flexDirection: 'row',
    gap: 24,
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF6D00',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    fontFamily: 'Roboto-Bold',
  },
  bannerContainer: {
    marginVertical: 16,
    alignItems: 'center',
  },
  bannerImageContainer: {
    overflow: 'hidden',
    borderRadius: 16,
    marginHorizontal: 12,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  bannerImage: {
    width: width - 24,
    height: height * 0.4,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  dot: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 8,
    width: 10,
    height: 10,
    marginHorizontal: 6,
  },
  activeDot: {
    backgroundColor: '#FFF',
    width: 12,
    height: 12,
  },
  titleSection: {
    padding: 24,
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginHorizontal: 12,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  productTitle: {
    fontSize: 24,
    fontFamily: 'Roboto-Bold',
    color: '#1A2526',
    lineHeight: 32,
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
    fontFamily: 'Roboto-Medium',
  },
  reviewCount: {
    color: '#007185',
    marginLeft: 12,
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
  },
  tag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tagText: {
    color: '#FFF',
    fontFamily: 'Roboto-Bold',
    fontSize: 12,
  },
  pricing: {
    padding: 24,
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginHorizontal: 12,
    marginBottom: 16,
    elevation: 4,
  },
  currentPrice: {
    fontSize: 32,
    fontFamily: 'Roboto-Bold',
    color: '#B12704',
    marginBottom: 8,
  },
  priceDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    color: '#666',
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    marginRight: 12,
  },
  discount: {
    color: '#28a745',
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
  },
  emi: {
    color: '#007185',
    fontSize: 14,
    marginVertical: 8,
    fontFamily: 'Roboto-Regular',
  },
  tax: {
    color: '#333',
    fontSize: 12,
    marginBottom: 12,
    fontFamily: 'Roboto-Regular',
  },
  stockContainer: {
    marginTop: 12,
  },
  stockText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Roboto-Medium',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  variants: {
    padding: 24,
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginHorizontal: 12,
    marginBottom: 16,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    color: '#1A2526',
    marginBottom: 16,
  },
  variantGroup: {
    marginBottom: 16,
  },
  variantLabel: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Roboto-Medium',
    marginBottom: 12,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 12,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    elevation: 2,
  },
  chipText: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
  },
  delivery: {
    padding: 24,
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginHorizontal: 12,
    marginBottom: 16,
    elevation: 4,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#1A2526',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
    fontFamily: 'Roboto-Regular',
    backgroundColor: '#F9F9F9',
  },
  inputError: {
    borderColor: '#D32F2F',
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
    fontFamily: 'Roboto-Regular',
  },
  deliveryText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontFamily: 'Roboto-Regular',
  },
  fastBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  fastBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontFamily: 'Roboto-Bold',
  },
  offers: {
    padding: 24,
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginHorizontal: 12,
    marginBottom: 16,
    elevation: 4,
  },
  offerItem: {
    marginRight: 12,
  },
  offerGradient: {
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  offerText: {
    fontSize: 14,
    color: '#FFF',
    fontFamily: 'Roboto-Medium',
  },
  details: {
    padding: 24,
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginHorizontal: 12,
    marginBottom: 16,
    elevation: 4,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  highlight: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    fontFamily: 'Roboto-Regular',
    flex: 1,
  },
  description: {
    padding: 24,
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginHorizontal: 12,
    marginBottom: 16,
    elevation: 4,
  },
  descriptionText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    fontFamily: 'Roboto-Regular',
  },
  stickyButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    gap: 12,
  },
  stickyButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  addToCart: {
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyNow: {
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
  },
});

export default ProductDetails;