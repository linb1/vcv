"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { RawNodeDatum } from "react-d3-tree";

const Tree = dynamic(() => import("react-d3-tree"), {
  ssr: false,
});

const NodeTree = () => {
  const [tree, setTree] = useState<RawNodeDatum | RawNodeDatum[]>({
    name: "Root",
    children: [],
  });

  return <Tree data={tree} />;
};

export default NodeTree;
