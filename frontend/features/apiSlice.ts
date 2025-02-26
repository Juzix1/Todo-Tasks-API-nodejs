import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080",
  }),
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: () => "/messages",
    }),
    createMessage: builder.mutation({
      query: (newMessage) => ({
        url: '/message',
        method: 'POST',
        body: newMessage,
      }),
    }),
    deleteMessage: builder.mutation({
      query: (id) => ({
        url: `/message/${id}`,
        method: "DELETE",
      }),
    }),
    updateMessage: builder.mutation<void, { id: number; message: string }>({
      query: ({ id, message }) => ({
        url: `/message/${id}`,
        method: "PUT", 
        body: { message },
      }),
    }),
  }),
});

export const {
  useCreateMessageMutation,
  useGetMessagesQuery,
  useDeleteMessageMutation,
  useUpdateMessageMutation,
} = apiSlice;
