import { configureStore } from "@reduxjs/toolkit";
import { factsApi } from "./facts";
import { imageApi } from "./image";

export const store = configureStore({
  reducer: {
    [factsApi.reducerPath]: factsApi.reducer,
    [imageApi.reducerPath]: imageApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(factsApi.middleware)
      .concat(imageApi.middleware),
});
