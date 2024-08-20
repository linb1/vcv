"use client";
import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { RawNodeDatum } from "react-d3-tree";
import NodeModal from "@/app/(components)/Modal";
import {
  useGetNodesQuery,
  useCreateNodeMutation,
  useCreateCommentMutation,
} from "@/state/api";

// Set server side rendering to false to allow for draggable screen
const Tree = dynamic(() => import("react-d3-tree"), {
  ssr: false,
});

type NodeFormData = {
  prev: string;
  name: string;
  path: string;
};

type CommentFormData = {
  tag: string;
  text: string;
};

const NodeTree = () => {
  const { data, isLoading } = useGetNodesQuery();
  const [createNode] = useCreateNodeMutation();
  const [createComment] = useCreateCommentMutation();

  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  //Process form to create node
  const handleCreateNode = async (nodeData: NodeFormData) => {
    await createNode(nodeData);
  };

  //Process form to create comment
  const handleCreateComment = async (commentData: CommentFormData) => {
    await createComment(commentData);
  };

  // Use default node if data is not defined
  const [tree, setTree] = useState<RawNodeDatum | RawNodeDatum[]>(
    data || {
      name: "Root",
      attributes: {
        id: "1",
        path: "root",
      },
      children: [],
    }
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isLoading) {
      // Update tree data
      setTree(data!);
    }

    if (containerRef.current) {
      // Calculate translation
      const { width, height } = containerRef.current.getBoundingClientRect();
      setTranslate({
        x: width / 2,
        y: height / 2,
      });
    }
  }, [containerRef, data, isLoading]);

  // Recursive function that checks all node. If no child exist, return empty array. Otherwise, continue until hovered node is found, then return branch
  const findBranchUpToRoot = (
    node: RawNodeDatum | null,
    id: string
  ): RawNodeDatum[] => {
    //Base case
    if (!node) return [];
    if (node.attributes?.id === id) return [node];

    let branch: RawNodeDatum[] = [];

    if (node.children) {
      for (const child of node.children) {
        const result = findBranchUpToRoot(child, id);
        if (result.length) {
          branch = [node, ...result];
          break;
        }
      }
    }
    return branch;
  };

  // Custom node element
  const renderRectSvgNode = ({
    nodeDatum,
    toggleNode,
  }: {
    nodeDatum: any;
    toggleNode: any;
  }) => {
    const nameBoxPadding = 5;
    const nameBoxHeight = 18;
    const nameBoxWidth = nodeDatum.name.length * 7 + 2 * nameBoxPadding;

    // Change stroke color based off branch
    const branch = findBranchUpToRoot(tree as RawNodeDatum, hoveredNodeId!);
    const isHoveredBranch = branch.some(
      (n) => n.attributes?.id === nodeDatum.attributes?.id
    );

    return (
      <g
        onClick={() => openModal(nodeDatum)}
        onMouseEnter={() => setHoveredNodeId(nodeDatum.attributes?.id)}
        onMouseLeave={() => setHoveredNodeId(null)}
      >
        <circle
          r="15"
          fill="lightgreen"
          stroke={isHoveredBranch ? "red" : "green"}
          strokeWidth="2"
          onClick={toggleNode}
        />
        <rect
          x={-nameBoxWidth / 2}
          y="20"
          width={nameBoxWidth}
          height={nameBoxHeight}
          fill="#FFCC66"
          stroke="#CC9900"
          strokeWidth="2"
        />
        <text
          fill="black"
          strokeWidth="1"
          y="34"
          textAnchor="middle"
          fontSize="14px"
          fontWeight="200"
        >
          {nodeDatum.name}
        </text>
        {nodeDatum.attributes?.id && (
          <text
            fill="black"
            y="50"
            textAnchor="middle"
            strokeWidth="0.5"
            fontSize="10px"
            fontWeight="100"
            fontFamily="serif"
          >
            id:{nodeDatum.attributes.id.slice(0, 5)}...
          </text>
        )}
      </g>
    );
  };

  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [selectedNode, setSelectedNode] = useState<RawNodeDatum>();

  const openModal = (nodeDatum: RawNodeDatum) => {
    setSelectedNode(nodeDatum);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedNode(undefined);
  };

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100vh" }}>
      <Tree
        data={tree}
        pathFunc="step"
        collapsible={false}
        renderCustomNodeElement={renderRectSvgNode}
        translate={translate}
      />
      {modalIsOpen && selectedNode && (
        <NodeModal
          modalIsOpen={modalIsOpen}
          closeModal={closeModal}
          selectedNode={selectedNode}
          onCreateNode={handleCreateNode}
          onCreateComment={handleCreateComment}
        />
      )}
    </div>
  );
};

export default NodeTree;
