import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RawNodeDatum } from "react-d3-tree";

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
  tagTypes: ["Nodes", "Comments", "NodesAndComments"],
  endpoints: (build) => ({
    getNodes: build.query<Nodes, void>({
      query: () => "/nodes",
      providesTags: ["Nodes"],
    }),
    getComments: build.query<Comments, void>({
      query: () => "/comments",
      providesTags: ["Comments"],
    }),
    getNodesAndComments: build.query<RawNodeDatum, void>({
      query: () => "/nodesAndComments",
      providesTags: ["NodesAndComments"],
    }),
  }),
});

export const {
  useGetNodesQuery,
  useGetCommentsQuery,
  useGetNodesAndCommentsQuery,
} = api;
