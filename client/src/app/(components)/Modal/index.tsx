"use client";
import React, { useState } from "react";
import Modal from "react-modal";
import { RawNodeDatum } from "react-d3-tree";
import { useGetCommentsByNodeIdQuery } from "@/state/api";
import Comment from "./modalComponents/comment";
import { X } from "lucide-react";

type NodeFormData = {
  prev: string;
  name: string;
  path: string;
};

type CommentFormData = {
  tag: string;
  text: string;
};

type NodeModalProps = {
  modalIsOpen: boolean;
  closeModal: () => void;
  selectedNode: RawNodeDatum;
  onCreateNode: (formData: NodeFormData) => void;
  onCreateComment: (formData: CommentFormData) => void;
  onDeleteNode: (nodeId: string[]) => void;
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
  onCreateComment,
  onDeleteNode,
}: NodeModalProps) => {
  // Get comments with node id
  const { data: comments } = useGetCommentsByNodeIdQuery(
    selectedNode!.attributes!.id.toString()
  );

  // Initial object sets prev to current node id
  const [nodeFormData, setNodeFormData] = useState({
    prev: selectedNode!.attributes!.id.toString(),
    name: "",
    path: "",
  });

  // Initial object sets tag to current node id
  const [commentFormData, setCommentFormData] = useState({
    tag: selectedNode!.attributes!.id.toString(),
    text: "",
  });

  // Submits node form data
  const handleSubmitNode = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCreateNode(nodeFormData);
    closeModal();
  };

  // Submits comment form data, then empties the textarea
  const handleSubmitComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCreateComment(commentFormData);
    setCommentFormData({
      ...commentFormData,
      text: "",
    });
  };

  // Updates useState for node
  const handleChangeNode = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setNodeFormData({
      ...nodeFormData,
      name: value,
      path: selectedNode!.attributes!.path.toString() + "/" + value,
    });
  };

  // Updates useState for comment
  const handleChangeComment = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setCommentFormData({
      ...commentFormData,
      text: value,
    });
  };

  // Use DFS to traverse and return all the child to be deleted
  const handleDeleteAll = () => {
    const ids: string[] = [];

    const traverse = (currentNode: RawNodeDatum) => {
      currentNode.children?.forEach((child) => traverse(child));

      ids.push(currentNode!.attributes!.id.toString());
    };

    traverse(selectedNode);

    onDeleteNode(ids);
    closeModal();
  };

  // Disables buttons if any inputs are empty
  const isAddNodeButtonDisabled = nodeFormData.name.trim().length === 0;
  const isAddCommentButtonDisabled = commentFormData.text.trim().length === 0;

  // Disables delete button if on root node
  const isDeleteNodeButtonDisabled =
    selectedNode.attributes?.path.toString() === "root";

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      contentLabel="Node Details"
      ariaHideApp={false}
      style={customStyles}
      shouldFocusAfterRender={false}
      className="absolute -translate-x-2/4 -translate-y-2/4 left-2/4 top-2/4 bg-white rounded-2xl shadow-md border border-slate-300 p-4 w-1/2 h-3/5 overflow-y-auto"
    >
      <div className="relative">
        {selectedNode && (
          <div>
            {/* HEADER */}
            <h2 className="text-2xl pb-2">Node: {selectedNode.name}</h2>
            <h2 className="text-2xl pb-2">ID: {selectedNode.attributes?.id}</h2>
            <button
              onClick={handleDeleteAll}
              disabled={isDeleteNodeButtonDisabled}
              className="py-2 px-4 mb-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-red-100 text-red-800 hover:bg-red-200 focus:outline-none focus:bg-blue-200 disabled:opacity-50 disabled:pointer-events-none"
            >
              Delete Node
            </button>

            <hr />

            {/* ADD NODE */}
            <div className="pb-10">
              <h3 className="text-xl pt-6">Add a New Node</h3>
              <form onSubmit={handleSubmitNode}>
                <div className="pt-3 pb-3">
                  <label
                    htmlFor="nodeName"
                    className="block text-sm font-medium mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    onChange={handleChangeNode}
                    value={nodeFormData.name}
                    className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:ring-blue-500"
                    placeholder="Name"
                  />
                </div>
                <button
                  type="submit"
                  className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-green-100 text-green-800 hover:bg-green-200 focus:outline-none focus:bg-blue-200 disabled:opacity-50 disabled:pointer-events-none"
                  disabled={isAddNodeButtonDisabled}
                >
                  Add Node
                </button>
              </form>
            </div>

            <hr />

            {/* COMMENT */}
            <div>
              <h3 className="text-xl pt-4">Comments</h3>
              <div className="pt-2 pb-3">
                <form onSubmit={handleSubmitComment}>
                  <div className="pt-3 pb-3">
                    <textarea
                      name="addComment"
                      onChange={handleChangeComment}
                      value={commentFormData.text}
                      className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:ring-blue-500"
                      placeholder="Add Comment"
                      rows={2}
                    />
                  </div>
                  <button
                    type="submit"
                    className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200 focus:outline-none focus:bg-blue-200 disabled:opacity-50 disabled:pointer-events-none"
                    disabled={isAddCommentButtonDisabled}
                  >
                    Add Comment
                  </button>
                </form>

                {/* COMMENT SECTION */}
                <div className="pt-6">
                  {comments &&
                    [...comments]
                      .reverse()
                      .map((comment) => (
                        <Comment comment={comment} key={comment.id} />
                      ))}
                </div>
              </div>
            </div>

            {/* CLOSE MODAL BUTTON */}
            <button
              className="absolute top-1 right-1 text-2xl"
              onClick={closeModal}
            >
              <X className="w-7 h-7 hover:opacity-50" />
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default NodeModal;
