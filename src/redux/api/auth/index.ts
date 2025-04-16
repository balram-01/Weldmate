import { baseApi } from "..";
import { FCMArgs, LoginApiArgs, LoginResponse } from "./types";

// Define a service using a base URL and expected endpoints
export const loginApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginApiArgs>({
      query: (payload) => {
        return {
          url: `login`,
          method: "POST",
          body: payload,
        };
      },
    }),
    register: builder.mutation<LoginResponse, LoginApiArgs>({
      query: (payload) => {
        return {
          url: `register`,
          method: "POST",
          body: payload,
        };
      },
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = loginApi;
