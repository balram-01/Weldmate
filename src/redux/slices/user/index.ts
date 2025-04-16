import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the user details type (matching your UserDetails interface)
interface UserDetails {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  phone: string;
  role: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// Define the initial state
interface UserState {
  user: UserDetails | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  isLoading: false,
  error: null,
};

// Create the user slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Set user data
    setUser: (state, action: PayloadAction<UserDetails>) => {
      state.user = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    // Set error state
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    // Clear user data (e.g., for logout)
    clearUser: (state) => {
      state.user = null;
      state.isLoading = false;
      state.error = null;
    },
  },
});

// Export actions
export const { setUser, setLoading, setError, clearUser } = userSlice.actions;

// Export reducer
export default userSlice.reducer;