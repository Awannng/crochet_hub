import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { supabase } from "../client";
import { IoPlayBackSharp } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegThumbsUp } from "react-icons/fa6";
import { FaArrowUp } from "react-icons/fa";

const ViewPost = () => {
  const { id } = useParams();
  const [comments, setComments] = useState([]);
  const [post, setPost] = useState({
    title: "",
    author: "",
    description: "",
    comment: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      // fetch a specific post based on id
      const { data: post_data } = await supabase
        .from("Post")
        .select()
        .eq("id", id)
        .single();

      setPost(post_data);

      // get comments based on post id
      const { data: post_comment } = await supabase
        .from("Comments")
        .select()
        .eq("post_id", id)
        .order("created_at", { ascending: false });

      setComments(post_comment);
    };
    fetchPost();
  }, [id]);

  // update the upvote count in the database
  const updateVote = async (e) => {
    e.preventDefault();

    // have a count of upvotes and increase it when clicking
    const upvote = (post.upvote || 0) + 1;

    await supabase
      .from("Post")
      .update({
        upvote: upvote,
      })
      .eq("id", id);

    // update the post where upvote is being added
    setPost((prev) => ({ ...prev, upvote: upvote }));
  };

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

  //  delete the data from the database
  const deletePost = async () => {
    await supabase.from("Post").delete().eq("id", id);
    navigate("/");
  };

  return (
    <>
      <div className="view-container">
        <Link className="back-link" to="/">
          <IoPlayBackSharp />
        </Link>
        <div className="view-post">
          <div className="post-heading">
            <h1>{post.title}</h1>
            <p>{String(post.created_at).substring(0, 10)}</p>
          </div>

          <div className="post-content">
            <p>Author: {post.author}</p>
            <img src={post.imageUrl} alt="post image" />
            <p>{post.description}</p>
          </div>

          <div className="post-buttons">
            <div className="upvote-button">
              <button onClick={updateVote}>
                <FaRegThumbsUp />
              </button>
              <p>Upvote: {post.upvote}</p>
            </div>

            <div>
              <Link className="edit-link" to={`/edit/${post.id}`}>
                <FaEdit />
              </Link>
              <button className="delete-btn" onClick={deletePost}>
                <RiDeleteBin6Line />
              </button>
              {/*Delete the post */}
            </div>
          </div>
        </div>

        <div className="comments-section">
          <h3>Comments</h3>
          {/* display the comments */}
          <div>
            {comments &&
              comments.map((comment, index) => {
                return (
                  <p className="each-comment" key={index}>
                    {comment.comment}
                  </p>
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
              <FaArrowUp />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewPost;
