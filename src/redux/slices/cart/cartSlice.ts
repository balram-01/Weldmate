import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the Product type based on your SearchScreen data
interface Product {
  id: string;
  name: string;
  price: number;
  image?: string; // Optional, assuming it could be a URI or local image
  brand?: {
    logo?: string;
  };
}

// Define the CartItem type (extends Product with quantity)
interface CartItem extends Product {
  quantity: number;
}

// Define the Cart state
interface CartState {
  items: CartItem[];
  total: number; // Total price of items in cart
}

// Initial state
const initialState: CartState = {
  items: [],
  total: 0,
};

// Storage key for AsyncStorage
const CART_STORAGE_KEY = 'cart';

// Utility to save cart to AsyncStorage
const saveCartToStorage = async (state: CartState) => {
  try {
    await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save cart to storage:', error);
  }
};

// Utility to load cart from AsyncStorage
const loadCartFromStorage = async (): Promise<CartState> => {
  try {
    const storedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
    if (storedCart) {
      return JSON.parse(storedCart);
    }
  } catch (error) {
    console.error('Failed to load cart from storage:', error);
  }
  return initialState; // Return initial state if loading fails or no data exists
};

// Create the cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Initialize cart from storage (call this when app starts)
    initializeCart: (state, action: PayloadAction<CartState>) => {
      state.items = action.payload.items;
      state.total = action.payload.total;
    },

    // Add product to cart
    addToCart: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);

      if (existingItem) {
        // If product exists, increment quantity
        existingItem.quantity += 1;
      } else {
        // Add new product with quantity 1
        state.items.push({
          ...product,
          quantity: 1,
          image: product.brand?.logo || product.image, // Normalize image source
        });
      }

      // Recalculate total
      state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

      // Save to storage
      saveCartToStorage(state);
    },

    // Remove product from cart
    removeFromCart: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.items = state.items.filter(item => item.id !== id);
      state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

      // Save to storage
      saveCartToStorage(state);
    },

    // Update quantity
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item && quantity > 0) {
        item.quantity = quantity;
        state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // Save to storage
        saveCartToStorage(state);
      }
    },

    // Clear cart
    clearCart: (state) => {
      state.items = [];
      state.total = 0;

      // Save to storage
      saveCartToStorage(state);
    },
  },
});

// Export actions
export const { addToCart, removeFromCart, updateQuantity, clearCart, initializeCart } = cartSlice.actions;

// Export reducer
export default cartSlice.reducer;

// Selector to get cart state
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartTotal = (state: { cart: CartState }) => state.cart.total;

// Thunk to load cart from storage and initialize state
export const loadCart = () => async (dispatch: any) => {
  const cartState = await loadCartFromStorage();
  dispatch(initializeCart(cartState));
};