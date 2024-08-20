import { useUpdateCommentMutation } from "@/state/api";
import React, { useState } from "react";
import { UserRound, Pencil, Save } from "lucide-react";

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

  // Processes PUT request for comment
  const handleUpdateComment = async (id: number) => {
    try {
      await updateComment({ id, text: displayedText }).unwrap();
    } catch (error) {
      console.error("Failed to update comment", error);
    }
  };

  // Handles if user is currently editing
  const handleIsEditing = () => {
    setDisplayedText(comment.text);
    setIsEditing(!isEditing);
  };

  // Updates useState for displayedText
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setDisplayedText(value);
  };

  //Submits form for updating comment
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleUpdateComment(comment.id);
    setIsEditing(false);
  };

  // Disables save button if the edit textarea is empty
  const isSaveButtonDisabled = displayedText.trim().length === 0;

  return (
    <div className="py-2 px-4 mb-3 rounded-lg bg-slate-50">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full border border-blue-300 flex justify-center items-center overflow-hidden flex-shrink-0">
          <UserRound className="w-10 h-10 bg-blue-200" color="#FFFFFF" />
        </div>
        {/* Render edit form or display comment based on isEditing */}
        {isEditing ? (
          <div className="w-full">
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
                  className="flex items-center justify-center gap-1 text-xs px-2 rounded-xl bg-green-100 hover:bg-green-200 disabled:opacity-50 disabled:pointer-events-none"
                  type="submit"
                  disabled={isSaveButtonDisabled}
                >
                  <Save className="w-3 h-3" />
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
              className="flex items-center justify-center gap-1 text-xs px-2 rounded-xl mt-2 bg-blue-100 hover:bg-blue-200"
              onClick={handleIsEditing}
            >
              <Pencil className="w-2 h-2" />
              Edit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;
