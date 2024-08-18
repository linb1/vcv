"use client";
import React, { useState } from "react";
import Modal from "react-modal";
import { RawNodeDatum } from "react-d3-tree";
import { useGetCommentsByNodeIdQuery } from "@/state/api";
import Comment from "./modalComponents/comment";

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
}: NodeModalProps) => {
  const { data: comments, isLoading } = useGetCommentsByNodeIdQuery(
    selectedNode!.attributes!.id.toString()
  );

  const [nodeFormData, setNodeFormData] = useState({
    prev: selectedNode!.attributes!.id.toString(),
    name: "",
    path: "",
  });

  const [commentFormData, setCommentFormData] = useState({
    tag: selectedNode!.attributes!.id.toString(),
    text: "",
  });

  const handleSubmitNode = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCreateNode(nodeFormData);
    closeModal();
  };

  const handleSubmitComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCreateComment(commentFormData);
    setCommentFormData({
      ...commentFormData,
      text: "",
    });
  };

  const handleChangeNode = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setNodeFormData({
      ...nodeFormData,
      name: value,
      path: selectedNode!.attributes!.path.toString() + "/" + value,
    });
  };

  const handleChangeComment = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setCommentFormData({
      ...commentFormData,
      text: value,
    });
  };

  console.log(comments);

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
            <div>{selectedNode.attributes?.path}</div>
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
                    className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                    placeholder="Name"
                  />
                </div>
                <button
                  type="submit"
                  className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200 focus:outline-none focus:bg-blue-200 disabled:opacity-50 disabled:pointer-events-none"
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
                      className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                      placeholder="Add Comment"
                      rows={2}
                    />
                  </div>
                  <button
                    type="submit"
                    className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200 focus:outline-none focus:bg-blue-200 disabled:opacity-50 disabled:pointer-events-none"
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
              X
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default NodeModal;
