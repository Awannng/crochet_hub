import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { supabase } from "../client";
import { IoPlayBackSharp } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegThumbsUp } from "react-icons/fa6";

const ViewPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState({
    title: "",
    author: "",
    description: "",
  });
  const navigate = useNavigate();

  // fetch a specific post based on id
  useEffect(() => {
    const fetchPost = async () => {
      const { data } = await supabase
        .from("Post")
        .select()
        .eq("id", id)
        .single();

      setPost(data);
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
              </button>{" "}
              {/*Delete the post */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewPost;
