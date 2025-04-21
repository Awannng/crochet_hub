import React from "react";
import { supabase } from "../client";
import { UserAuth } from "../context/AuthContext";
import { getTimeAgo } from "../utils";
import { FaArrowUp } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";

const Comment = ({ comments, post, setPost, setComments, id }) => {
  const { session } = UserAuth();

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
      .insert({ comment: post.comment, post_id: id, uid: session.user.id })
      .select();

    // allows comment to be shown when added simultaneously
    setComments((prev) => [data[0], ...prev]);
    // refresh the comment input box
    setPost((prev) => ({ ...prev, comment: "" }));
  };

  // Delete comments under the post
  const deleteComment = async (id) => {
    // delete based on param: comment.id
    await supabase.from("Comments").delete().eq("id", id);

    // Update local state by filtering out the deleted comment
    const updatedComments = comments.filter((comment) => comment.id !== id);
    setComments(updatedComments);
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
                <div className="comment-content">
                  <p>{comment.comment}</p>

                  {/* Allows user to delete comments under their own post and allows to delete own comment under other's post */}
                  {(session.user.id === post.uid ||
                    session.user.id === comment.uid) && (
                    <RiDeleteBin6Line
                      className="delete-btn"
                      onClick={() => deleteComment(comment.id)}
                    />
                  )}
                </div>
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
