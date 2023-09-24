import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const stableDiffusionApiKey = import.meta.env.VITE_STABLE_DIFFUSION_API_KEY;

export const imageApi = createApi({
  reducerPath: "imageApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://stablediffusionapi.com/api/v3/text2img",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    generateImage: builder.mutation({
      query: (data) => ({
        method: "POST",
        body: {
          key: stableDiffusionApiKey,
          ...data,
        },
      }),
    }),
  }),
});

export const { useGenerateImageMutation } = imageApi;
