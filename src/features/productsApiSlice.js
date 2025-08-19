import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8070/api/" }), // Laravel API base
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => "products", // your endpoint to fetch all products
    }),
    getProductById: builder.query({
      query: (id) => `products/${id}`, // endpoint to fetch single product
    }),
  }),
});

export const { useGetProductsQuery, useGetProductByIdQuery } = productsApi;
