"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { RawNodeDatum } from "react-d3-tree";
import NodeModal from "@/app/(components)/Modal";
import { useGetNodesQuery, useCreateNodeMutation } from "@/state/api";

const Tree = dynamic(() => import("react-d3-tree"), {
  ssr: false,
});

type NodeFormData = {
  prev: string;
  name: string;
  path: string;
};

const NodeTree = () => {
  const { data, isLoading } = useGetNodesQuery();
  const [createNode] = useCreateNodeMutation();
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const handleCreateNode = async (nodeData: NodeFormData) => {
    await createNode(nodeData);
  };

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

  useEffect(() => {
    if (!isLoading) {
      setTree(data!);
    }
  });

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
    <>
      <Tree
        data={tree}
        pathFunc="step"
        collapsible={false}
        renderCustomNodeElement={renderRectSvgNode}
        translate={{
          x: 500,
          y: 350,
        }}
      />
      {modalIsOpen && selectedNode && (
        <NodeModal
          modalIsOpen={modalIsOpen}
          closeModal={closeModal}
          selectedNode={selectedNode}
          onCreateNode={handleCreateNode}
        />
      )}
    </>
  );
};

export default NodeTree;
