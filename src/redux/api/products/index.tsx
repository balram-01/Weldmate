import { baseApi } from '..'; // Adjust the import path as needed

// Define interfaces for the product-related data
interface Brand {
  id: number;
  name: string;
  slug: string;
  logo?: string; // Optional, only in getProducts
  meta_title?: string; // Optional, only in getProducts
  meta_keywords?: string[]; // Optional, only in getProducts
  description?: string; // Optional, only in getProducts
  status?: string; // Optional, only in getProducts
  created_at?: string; // Optional, only in getProducts
  updated_at?: string; // Optional, only in getProducts
  deleted_at?: string | null; // Optional, only in getProducts
}

interface Product {
  id: number;
  reseller_id: number | null;
  category_id: number;
  brand_id: number;
  name: string;
  slug: string;
  description: string;
  price: string; // Stored as string in response (e.g., "123.00")
  stock: number;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  category: any | null; // Assuming category could be an object or null (not detailed in response)
  brand: Brand;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface ProductsResponse {
  success: boolean;
  data: {
    current_page: number;
    data: Product[];
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
  };
}

interface ProductDetailsResponse {
  success: boolean;
  data: Product;
}

// Inject endpoints into the existing baseApi
export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get Products (paginated list)
    getProducts: builder.query<ProductsResponse, { page?: number }>({
      query: ({ page = 1 }) => ({
        url: `products?page=${page}`,
        method: 'GET',
      }),
    }),

    // Get Product Details by ID
    getProductDetails: builder.query<ProductDetailsResponse, number>({
      query: (productId) => ({
        url: `products/${productId}`,
        method: 'GET',
      }),
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetProductsQuery,
  useLazyGetProductsQuery, // For manual triggering if needed
  useGetProductDetailsQuery,
} = productsApi;