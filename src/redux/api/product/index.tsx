import { baseApi } from "..";

// Existing interfaces
interface WishlistResponse {
  success: boolean;
  message: string;
  data?: {
    user_id: number;
    product_id: number;
  };
}

interface WishlistPayload {
  user_id: number;
  product_id: number;
}

interface Brand {
  id: number;
  name: string;
  slug: string;
  logo: string;
  meta_title: string;
  meta_keywords: string[];
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ProductDetails {
  id: number;
  reseller_id: number | null;
  category_id: number;
  brand_id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  stock: number;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  category: Category | null;
  brand: Brand;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface ProductsResponseData {
  current_page: number;
  data: ProductDetails[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

interface ProductsResponse {
  success: boolean;
  data: ProductsResponseData;
  message?: string;
}

interface ProductQueryParams {
  category?: string;
  brand?: string;
  min_price?: number;
  max_price?: number;
  sort_by?: string;
  limit?: number;
}

interface Subcategory {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
  image: string;
  created_at: string;
  updated_at: string;
  status: number;
  deleted_at: string | null;
  image_url: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
  image: string;
  created_at: string;
  updated_at: string;
  status: number;
  deleted_at: string | null;
  image_url: string;
  subcategories: Subcategory[];
}

interface CategoriesResponse {
  success: boolean;
  data: Array<Category>;
  message?: string;
}

interface SearchQueryParams {
  query: string;
  category?: string;
  brand?: string;
  min_price?: number;
  max_price?: number;
  sort_by?: string;
  limit?: number;
  page?: number;
}

interface SearchResponse {
  success: boolean;
  data: ProductsResponseData | [];
  message?: string;
  errors?: {
    query?: string[];
    [key: string]: any;
  };
}

interface CartCountResponse {
  status: boolean;
  user_id: string;
  cart_count: string;
}

interface CartResponse {
  status: boolean;
  message: string;
}

interface CartProduct {
  id: number;
  name: string;
  slug: string;
  price: string;
  discount_price: string;
  stock: number;
  status: string;
  product_img_path: string;
}

interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  created_at: string;
  updated_at: string;
  product: CartProduct;
}

interface CartDetailsResponse {
  status: boolean;
  data: CartItem[];
  message?: string;
}

interface WishlistPrice {
  mrp: number;
  sale_price: number;
  currency: string;
  discount_percent: number;
}

interface WishlistRating {
  average: number;
  count: number;
}

interface WishlistVariant {
  variant_id: string;
  name: string | null;
  price: number;
  stock_status: string;
}

interface WishlistBrand {
  brand_id: string;
  name: string;
  logo_url: string;
}

interface WishlistCategory {
  category_id: string;
  name: string;
  slug: string;
}

interface WishlistProduct {
  product_id: string;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  brand: WishlistBrand;
  price: WishlistPrice;
  images: any[];
  stock_status: string;
  rating: WishlistRating;
  is_in_wishlist: boolean;
  variants: WishlistVariant[];
  category: WishlistCategory;
  tags: any[];
}

interface WishlistItem {
  wishlist_id: string;
  user_id: string;
  added_at: string;
  product: WishlistProduct;
}

interface WishlistPagination {
  current_page: number;
  total_pages: number;
  total_items: number;
  per_page: number;
}

interface WishlistResponseData {
  wishlist: WishlistItem[];
  pagination: WishlistPagination;
}

interface AddToCartPayload {
  user_id: number;
  product_id: number;
  quantity: number;
}

// Define the service
export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, ProductQueryParams | void>({
      query: (params = {}) => ({
        url: `allProducts`,
        method: "GET",
        params: params as ProductQueryParams,
      }),
      providesTags: ["products"],
    }),

    getProductDetails: builder.query<ProductDetails, number>({
      query: (productId) => ({
        url: `products/products/${productId}`,
        method: "GET",
      }),
      providesTags: ["products"],
    }),

    getProductCategories: builder.query<CategoriesResponse, void>({
      query: () => ({
        url: `products/get-product-categories`,
        method: "GET",
      }),
      providesTags: ["products"],
    }),

    searchProducts: builder.query<SearchResponse, SearchQueryParams>({
      query: (params) => ({
        url: `products/products/search`,
        method: "GET",
        params,
      }),
      providesTags: ["products"],
    }),

    getAllCategoriesWithSubcategories: builder.query<CategoriesResponse, void>({
      query: () => ({
        url: 'products/getAllCategoriesWithSubcategories',
        method: 'GET',
      }),
    }),

    addToWishlist: builder.mutation<WishlistResponse, WishlistPayload>({
      query: (payload) => ({
        url: 'products/add-to-wishlist',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['products', 'wishlist'],
    }),

    removeFromWishlist: builder.mutation<WishlistResponse, WishlistPayload>({
      query: (payload) => ({
        url: 'products/remove-from-wishlist',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['products', 'wishlist'],
    }),

    getCartCount: builder.query<CartCountResponse, number>({
      query: (userId) => ({
        url: `products/get-cart-count/${userId}`,
        method: 'GET',
      }),
      providesTags: ['cart'],
    }),

    addToCart: builder.mutation<CartResponse, AddToCartPayload>({
      query: (payload) => ({
        url: 'products/add-to-cart',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['cart'],
    }),

    removeFromCart: builder.mutation<CartResponse, number>({
      query: (id) => ({
        url: `products/remove-from-cart/${id}`,
        method: 'POST',
      }),
      invalidatesTags: ['cart'],
    }),

    getCartDetails: builder.query<CartDetailsResponse, number>({
      query: (userId) => ({
        url: `products/get-cart-items/${userId}`,
        method: 'GET',
      }),
      providesTags: ['cart'],
    }),

    getWishlist: builder.query<WishlistResponseData, number>({
      query: (userId) => ({
        url: `products/wishlist/${userId}`,
        method: 'GET',
      }),
      providesTags: ['wishlist'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useGetProductCategoriesQuery,
  useSearchProductsQuery,
  useGetAllCategoriesWithSubcategoriesQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useGetCartCountQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useGetCartDetailsQuery,
  useGetWishlistQuery,
} = productApi;