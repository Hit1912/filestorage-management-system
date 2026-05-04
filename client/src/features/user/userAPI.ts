import { apiClient } from "@/app/api-client";

export const userApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    updateUser: builder.mutation<{ message: string; user: any }, { name: string }>({
      query: (body) => ({
        url: "/user/update",
        method: "PATCH",
        body,
      }),
    }),
  }),
});

export const { useUpdateUserMutation } = userApi;
