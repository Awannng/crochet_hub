import React from "react";
import { supabase } from "../client";
import { getTimeAgo } from "../utils";
import { FaArrowUp } from "react-icons/fa";

const Comment = ({ comments, post, setPost, setComments, id }) => {
  // for comment input box type
  const handleComment = (e) => {
    setPost((prev) => {
      return { ...prev, comment: e.target.value };
    });
  };

  // insert comment to supabase Comments table with foregin key connected to individual Post
  const addComment = async (e) => {
    e.preventDefault();
    if (post.comment === "") {
      alert("Comment cannot be empty");
      return;
    }
    const { data } = await supabase
      .from("Comments")
      .insert({ comment: post.comment, post_id: id })
      .select();

    // allows comment to be shown when added simultaneously
    setComments((prev) => [data[0], ...prev]);
    // refresh the comment input box
    setPost((prev) => ({ ...prev, comment: "" }));
  };

  return (
    <div className="comments-section">
      <h3>Comments</h3>
      {/* display the comments */}
      <div>
        {comments &&
          comments.map((comment, index) => {
            return (
              <div key={index} className="each-comment">
                <p>{comment.comment}</p>
                <small>{getTimeAgo(comment.created_at)}</small>
              </div>
            );
          })}
      </div>
      <div className="comment-item">
        <input
          type="text"
          name="comment"
          id="comment"
          placeholder="Leave a comment..."
          value={post.comment}
          onChange={handleComment}
        />
        <button onClick={addComment}>
          <FaArrowUp className="comment-btn" />
        </button>
      </div>
    </div>
  );
};

export default Comment;
