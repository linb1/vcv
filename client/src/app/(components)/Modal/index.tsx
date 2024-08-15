"use client";
import React from "react";
import Modal from "react-modal";
import { RawNodeDatum } from "react-d3-tree";

type NodeModalProps = {
  modalIsOpen: boolean;
  closeModal: () => void;
  selectedNode: RawNodeDatum | null;
};

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.25)",
  },
};

const NodeModal = ({
  modalIsOpen,
  closeModal,
  selectedNode,
}: NodeModalProps) => {
  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      contentLabel="Node Details"
      ariaHideApp={false}
      style={customStyles}
      shouldFocusAfterRender={false}
      className="absolute -translate-x-2/4 -translate-y-2/4 left-2/4 top-2/4 bg-white rounded-2xl shadow-md border border-slate-300 p-4 w-1/2 h-1/2 overflow-y-auto"
    >
      <div className="relative">
        {selectedNode && (
          <div>
            {/* HEADER */}
            <h2 className="text-2xl pb-2">Node: {selectedNode.name}</h2>
            <div>{selectedNode.attributes?.id}</div>
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
                  value={
                    selectedNode.attributes?.comment
                      ? selectedNode.attributes?.comment.toLocaleString()
                      : ""
                  }
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
  );
};

export default NodeModal;
