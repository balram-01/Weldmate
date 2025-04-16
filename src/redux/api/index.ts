import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseApiTags } from "./constant";
import { API_TOKEN, REACT_APP_BASE_URL } from "@env";
import { getToken } from "../../utils/authStorage";

export const baseApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: `${REACT_APP_BASE_URL}/api/`,
    prepareHeaders: async (headers) => {
      const token = await getToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
        console.log("Headers set:", headers.get("Authorization"));
      }
      return headers;
    },
  }),
  keepUnusedDataFor: 30,
  tagTypes: baseApiTags,
  endpoints: (build) => ({}),
});
