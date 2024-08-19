import { useUpdateCommentMutation } from "@/state/api";
import React, { useState } from "react";

export interface Comment {
  id: number;
  tag: string;
  text: string;
}

type CommentProps = {
  comment: Comment;
};

const Comment = ({ comment }: CommentProps) => {
  const [updateComment] = useUpdateCommentMutation();
  const [displayedText, setDisplayedText] = useState(comment.text);
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdateComment = async (id: number) => {
    try {
      await updateComment({ id, text: displayedText }).unwrap();
    } catch (error) {
      console.error("Failed to update comment", error);
    }
  };

  const handleIsEditing = () => {
    setDisplayedText(comment.text);
    setIsEditing(!isEditing);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setDisplayedText(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleUpdateComment(comment.id);
    setIsEditing(false);
  };

  const isSaveButtonDisabled = displayedText.trim().length === 0;

  return (
    <div className="p-2 mb-3 rounded-lg bg-slate-50">
      {isEditing ? (
        <div>
          <form onSubmit={handleSubmit}>
            <div>
              <textarea
                name="editComment"
                onChange={handleChange}
                value={displayedText}
                className="p-2 block w-full border border-gray-200 rounded-lg text-sm focus:ring-blue-500"
                rows={2}
              />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <button
                className="text-xs px-2 rounded-xl bg-green-100 hover:bg-green-200 disabled:opacity-50 disabled:pointer-events-none"
                type="submit"
                disabled={isSaveButtonDisabled}
              >
                Save
              </button>
              <button
                className="text-xs px-2 rounded-xl bg-red-100 hover:bg-red-200"
                onClick={handleIsEditing}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div>
          <div>{displayedText}</div>
          <button
            className="text-xs px-2 rounded-xl bg-blue-100 hover:bg-blue-200"
            onClick={handleIsEditing}
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

export default Comment;
