import { baseApi } from "..";

// Define types for the payloads and responses
interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  role: string;
  password: string;
}

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

interface UpdateUserPayload {
  name: string;
  email: string;
  phone: string;
  status: string;
}

interface VerifyOtpPayload {
  email: string;
  otp: string;
}

interface ResetPasswordPayload {
  email: string;
  new_password: string;
  new_password_confirmation: string;
}

interface ResetRequestPayload {
  email: string;
}
// New interface for Bank Details
interface BankDetailsPayload {
  account_holder: string;
  bank_name: string;
  id:string;
  account_number: string;
  ifsc_code: string;
  swift_code: string;
  branch_name: string;
  country: string;
  upi_id: string;
  status: number;
  user_id: number;
  card_name: string;
  card_number: string;
  card_cvv_no: string;
  card_expiry_date: string;
  card_holder_name: string;
}
// Define the service using a base URL and expected endpoints
export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
   

    // Get user details endpoint
    getUserDetails: builder.query<UserDetails, number>({
      query: (userId) => ({
        url: `getUserDetails/${userId}`,
        method: "GET",
        
      }),
    }),

    // Update user details endpoint
    updateUser: builder.mutation<any, { userId: number; data: FormData }>({
      query: ({ userId, data }) => ({
        url: `updateUser/${userId}`,
        method: "POST",
    
        body: data,
        headers: {
          // Note: When using FormData, you typically don't need to set Content-Type
          // manually as the browser will set it automatically with the proper boundary
          'Content-Type': 'multipart/form-data',
        },
      }),
    }),

    // Verify OTP endpoint
    verifyOtp: builder.mutation<any, VerifyOtpPayload>({
      query: (data) => ({
        url: "password/verify-otp",
        method: "POST",
        body: data,
      }),
    }),

    // Reset password endpoint
    resetPassword: builder.mutation<any, ResetPasswordPayload>({
      query: (data) => ({
        url: "password/reset-password",
        method: "POST",
        body: data,
      }),
    }),

    // Password reset request endpoint
    resetPasswordRequest: builder.mutation<any, ResetRequestPayload>({
      query: (data) => {
        console.log('sending data into body',data)
        return({
          url: "password/reset-request",
          method: "POST",
          body: data,
        })
      },
    }),
    
    // New bank-related endpoints
    updateBankDetails: builder.mutation<any, { userId: number; data: BankDetailsPayload }>({
      query: ({ userId, data }) => ({
        url: `bankDetails/update-bank-details/${userId}`,
        method: "POST",
        body: data,
      }),
    }),

    addBankDetails: builder.mutation<any, BankDetailsPayload>({
      query: (data) => ({
        url: "bankDetails/add-bank-details",
        method: "POST",
        body: data,
        
      }),
      invalidatesTags:['paymentDetails']
    }),

    getBankDetailsByUserId: builder.query<any, number>({
      query: (userId) => ({
        url: `bankDetails/get-bank-details/${userId}`,
        method: "GET",
      }),
      providesTags:['paymentDetails']
    }),
  }),
});

// Export hooks for usage in components
export const {
 useLazyGetUserDetailsQuery,
  useGetUserDetailsQuery,
  useUpdateUserMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
  useResetPasswordRequestMutation,
  useUpdateBankDetailsMutation,
  useGetBankDetailsByUserIdQuery,
  useAddBankDetailsMutation
} = userApi;