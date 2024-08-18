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
    setIsEditing(!isEditing);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setDisplayedText(value);
  };

  const handleSubmit = () => {
    handleUpdateComment(comment.id);
    setIsEditing(!isEditing);
  };

  return (
    <div>
      {isEditing ? (
        <div>
          <form onSubmit={handleSubmit}>
            <div className="pt-3 pb-3">
              <input
                type="text"
                name="addComment"
                onChange={handleChange}
                value={displayedText}
                className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                placeholder="Add Comment"
              />
            </div>
            <button className="text-xs border border-black" type="submit">
              Save
            </button>
          </form>
        </div>
      ) : (
        <div>
          <div>{displayedText}</div>
          <button
            className="text-xs border border-black"
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
