import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const rapidApiKey = import.meta.env.VITE_RAPID_API_FACTS_KEY;
const openAiKey = import.meta.env.VITE_OPEN_AI_API_KEY;

export const factsApi = createApi({
  reducerPath: "factsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://interesting-facts-api.p.rapidapi.com/",
    prepareHeaders: (headers) => {
      headers.set("X-RapidAPI-Key", rapidApiKey);
      headers.set("X-RapidAPI-Host", "interesting-facts-api.p.rapidapi.com");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getFacts: builder.query({
      query: (params) =>
        `/api/${openAiKey}/${encodeURIComponent(params.prompt)}`,
    }),
  }),
});

export const { useLazyGetFactsQuery } = factsApi;
