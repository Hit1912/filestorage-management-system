import { createApi } from "@reduxjs/toolkit/query/react";
import { mockBaseQuery } from "./mock-base-query";

export const apiClient = createApi({
  reducerPath: "api", // Add API client reducer to root reducer
  baseQuery: mockBaseQuery,
  refetchOnMountOrArgChange: true, // Refetch on mount or arg change
  tagTypes: ["files", "analytics", "apikey"], // Tag types for RTK Query
  endpoints: () => ({}), // Endpoints for RTK Query
});
