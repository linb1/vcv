"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { RawNodeDatum } from "react-d3-tree";

const Tree = dynamic(() => import("react-d3-tree"), {
  ssr: false,
});

const NodeTree = () => {
  const [tree, setTree] = useState<RawNodeDatum | RawNodeDatum[]>({
    name: "A",
    attributes: {
      id: "87F0C113-97D6-4356-B874-44FD17BE713C",
    },
    children: [
      {
        name: "B",
        attributes: {
          id: "5EAA7325-0169-40D7-A3F0-5B43DB3F7DD2",
        },
        children: [],
      },
      {
        name: "C",
        attributes: {
          id: "8FF6ADC6-91B2-40CF-A721-8809C9F4825A",
          comment: "Lorem ipsum dolor sit",
        },
        children: [
          {
            name: "D",
            attributes: {
              id: "2FBFFD55-498D-4B91-AF0D-165DF990EAF5",
            },
            children: [],
          },
        ],
      },
    ],
  });

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
    return (
      <g>
        <circle
          r="15"
          fill="lightgreen"
          stroke="green"
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

  return (
    <Tree
      data={tree}
      pathFunc="step"
      renderCustomNodeElement={renderRectSvgNode}
      translate={{
        x: 500,
        y: 350,
      }}
    />
  );
};

export default NodeTree;
