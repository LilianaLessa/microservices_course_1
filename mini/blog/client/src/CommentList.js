import React from "react";


function getContent(comment) {
  switch (comment.status) {
    case 'approved': return comment.content;
    case 'rejected': return 'This comment has been rejected';
    case 'pending': return 'This comment is awaiting moderation';
    default: return 'ERROR';
  } 
}

const CommentList = ({ comments }) => {
  
  console.log(comments);
  const renderedComments = comments.map((comment) => {


    return <li key={comment.id}>{getContent(comment)}</li>;
  });

  return <ul>{renderedComments}</ul>;
};

export default CommentList;
