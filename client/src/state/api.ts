import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Nodes {
  id: string;
  prev: boolean;
  name: string;
  path: string;
}

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  reducerPath: "api",
  tagTypes: ["Nodes"],
  endpoints: (build) => ({
    getNodes: build.query<Nodes, void>({
      query: () => "/nodes",
      providesTags: ["Nodes"],
    }),
  }),
});

export const { useGetNodesQuery } = api;
