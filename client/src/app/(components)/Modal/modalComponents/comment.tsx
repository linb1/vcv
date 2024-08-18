import React from "react";

export interface Comment {
  id: number;
  tag: string;
  text: string;
}

type CommentProps = {
  comment: Comment;
};

const Comment = (props: CommentProps) => {
  return <div>Comment</div>;
};

export default Comment;
