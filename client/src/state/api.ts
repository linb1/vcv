import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Nodes {
  id: string;
  prev: string | null;
  name: string;
  path: string;
}

export interface Comments {
  id: string;
  tag: string;
  text: string;
}

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  reducerPath: "api",
  tagTypes: ["Nodes", "Comments"],
  endpoints: (build) => ({
    getNodes: build.query<Nodes, void>({
      query: () => "/nodes",
      providesTags: ["Nodes"],
    }),
    getComments: build.query<Comments, void>({
      query: () => "/comments",
      providesTags: ["Comments"],
    }),
  }),
});

export const { useGetNodesQuery, useGetCommentsQuery } = api;
