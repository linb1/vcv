"use client";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { RawNodeDatum } from "react-d3-tree";
import { useGetCommentsByNodeIdQuery } from "@/state/api";

type NodeFormData = {
  prev: string;
  name: string;
  path: string;
};

type CommentFormData = {
  tag: string;
  text: string;
};

interface Comment {
  id: number;
  tag: string;
  text: string;
}

type NodeModalProps = {
  modalIsOpen: boolean;
  closeModal: () => void;
  selectedNode: RawNodeDatum;
  onCreateNode: (formData: NodeFormData) => void;
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
  onCreateNode,
}: NodeModalProps) => {
  const {
    data: comments,
    error,
    isLoading,
  } = useGetCommentsByNodeIdQuery(selectedNode!.attributes!.id.toString());
  console.log("query", comments);
  const [nodeFormData, setNodeFormData] = useState({
    prev: "",
    name: "",
    path: "",
  });
  const [commentFormData, setCommentFormData] = useState({
    tag: "",
    text: "",
  });

  const [commentArray, setCommentArray] = useState<Comment[]>([]);

  useEffect(() => {
    if (selectedNode?.attributes) {
      setNodeFormData({
        ...nodeFormData,
        prev: selectedNode.attributes.id.toString(),
        path: selectedNode.attributes.path.toString() + "/" + nodeFormData.name,
      });
    }
  }, [selectedNode, nodeFormData.name]);

  useEffect(() => {
    if (selectedNode?.attributes?.comments) {
      setCommentArray(JSON.parse(selectedNode?.attributes?.comments as string));
    }
  }, [selectedNode]);
  // todo: remove this and replace with closemodal
  const closeAndReset = () => {
    closeModal();
    // setNodeFormData({
    //   ...nodeFormData,
    //   name: "",
    // });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCreateNode(nodeFormData);
    closeAndReset();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNodeFormData({
      ...nodeFormData,
      [name]: value,
    });
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeAndReset}
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
            <div>{selectedNode.attributes?.path}</div>
            <hr />
            {/* ADD NODE */}
            <div className="pb-10">
              <h3 className="text-xl pt-6">Add a New Node</h3>
              {/* NAME */}
              <form onSubmit={handleSubmit}>
                <div className="pt-6 pb-3">
                  <label
                    htmlFor="nodeName"
                    className="block text-sm font-medium mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    onChange={handleChange}
                    value={nodeFormData.name}
                    className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                    placeholder="Name"
                  />
                </div>

                {/* BUTTON */}
                <button
                  type="submit"
                  className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200 focus:outline-none focus:bg-blue-200 disabled:opacity-50 disabled:pointer-events-none"
                >
                  Add Node
                </button>
              </form>
            </div>

            <hr />

            {/* EDIT COMMENT */}
            <div>
              <h3 className="text-xl pt-4">Comments</h3>
              <div className="pt-2 pb-3">
                {comments &&
                  comments.map((comment, index) => (
                    <div key={index}>
                      <div>{comment.text}</div>
                      <div>{comment.tag}</div>
                    </div>
                  ))}
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
              onClick={closeAndReset}
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
