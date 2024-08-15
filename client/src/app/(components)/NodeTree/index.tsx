"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { RawNodeDatum } from "react-d3-tree";
import Modal from "react-modal";

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
      <g onClick={() => openModal(nodeDatum)}>
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

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<RawNodeDatum | null>(null);

  const openModal = (nodeDatum: RawNodeDatum) => {
    setSelectedNode(nodeDatum);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedNode(null);
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
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Node Details"
        ariaHideApp={false}
        className="absolute -translate-x-2/4 -translate-y-2/4 left-2/4 top-2/4 bg-white rounded-2xl shadow-md border border-slate-300 p-4 w-1/2 h-1/2 overflow-y-auto"
      >
        <div className="relative">
          {selectedNode && (
            <div>
              {/* HEADER */}
              <h2 className="text-2xl pb-2">Node: {selectedNode.name}</h2>
              <hr />
              {/* ADD NODE */}
              <div className="pb-10">
                <h3 className="text-xl pt-6">Add a New Node</h3>
                {/* NAME */}
                <div className="pt-6">
                  <label
                    htmlFor="input-label"
                    className="block text-sm font-medium mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                    placeholder="This is placeholder"
                  />
                </div>
                {/* COMMENT */}
                <div className="pt-2 pb-3">
                  <div className="flex justify-between items-center">
                    <label
                      htmlFor="with-corner-hint"
                      className="block text-sm font-medium mb-2"
                    >
                      Comment
                    </label>
                    <span className="block mb-2 text-sm text-gray-500 dark:text-neutral-500">
                      Optional
                    </span>
                  </div>
                  <textarea
                    className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                    rows={3}
                    placeholder="This is a textarea placeholder"
                  />
                </div>
                {/* BUTTON */}
                <button
                  type="button"
                  className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200 focus:outline-none focus:bg-blue-200 disabled:opacity-50 disabled:pointer-events-none"
                >
                  Add Node
                </button>
              </div>

              <hr />

              {/* EDIT COMMENT */}
              <div>
                <h3 className="text-xl pt-4">Edit Comment</h3>
                <div className="pt-2 pb-3">
                  <textarea
                    className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                    rows={3}
                    placeholder="This is a textarea placeholder"
                  />
                </div>
                {/* Button */}
                <button
                  type="button"
                  className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200 focus:outline-none focus:bg-blue-200 disabled:opacity-50 disabled:pointer-events-none"
                >
                  Update
                </button>
              </div>
              <button
                className="absolute top-1 right-1 text-2xl"
                onClick={closeModal}
              >
                X
              </button>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default NodeTree;
