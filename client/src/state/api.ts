import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RawNodeDatum } from "react-d3-tree";

export interface Node {
  id: string;
  prev: string | null;
  name: string;
  path: string;
}

export interface NewNode {
  prev: string | null;
  name: string;
  path: string;
}

export interface Comments {
  id: string;
  tag: string;
  text: string;
}

export interface NewComment {
  tag: string;
  text: string;
}

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  reducerPath: "api",
  tagTypes: ["Nodes", "Comments"],
  endpoints: (build) => ({
    getNodes: build.query<RawNodeDatum, void>({
      query: () => "/nodes",
      providesTags: ["Nodes"],
    }),
    getComments: build.query<Comments, void>({
      query: () => "/comments",
      providesTags: ["Comments"],
    }),
    getCommentsByNodeId: build.query<Comments[], string>({
      query: (nodeId) => `/comments/node/${nodeId}`,
      providesTags: ["Comments"],
    }),
    createNode: build.mutation<Node, NewNode>({
      query: (newNode) => ({
        url: "/nodes",
        method: "POST",
        body: newNode,
      }),
      invalidatesTags: ["Nodes"],
    }),
    createComment: build.mutation<Comments, NewComment>({
      query: (newComment) => ({
        url: "/comments",
        method: "POST",
        body: newComment,
      }),
      invalidatesTags: ["Comments"],
    }),
  }),
});

export const {
  useGetNodesQuery,
  useGetCommentsQuery,
  useCreateNodeMutation,
  useGetCommentsByNodeIdQuery,
  useCreateCommentMutation,
} = api;
