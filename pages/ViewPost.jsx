import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { supabase } from "../client";
import { IoPlayBackSharp } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegThumbsUp } from "react-icons/fa6";
import Comment from "../components/Comment";
import { UserAuth } from "../context/AuthContext";

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
  const { session } = UserAuth();

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

    // update the upvote in the supabase
    await supabase
      .from("Post")
      .update({
        upvote: upvote,
      })
      .eq("id", id);

    // update the post where upvote is being added
    setPost((prev) => ({ ...prev, upvote: upvote }));
  };

  //  delete the post, comments, image from the database
  const deletePost = async () => {
    // 1. Delete comments first (to avoid foreign key conflicts)
    await supabase.from("Comments").delete().eq("post_id", id);
    // 2. Delete the post
    await supabase.from("Post").delete().eq("id", id);

    // 3. Delete the image from storage (if it exists)
    const imgArr = String(post.imageUrl).split("/");
    await supabase.storage.from("post-image").remove([`images/${imgArr[9]}`]);
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
            {/* shows image when there is one */}
            {post.imageUrl && (
              <img
                className="post-image"
                src={post.imageUrl}
                alt="post image"
              />
            )}
            <p className="description">{post.description}</p>
          </div>

          <div className="post-buttons">
            <div className="upvote-button">
              <button onClick={updateVote}>
                <FaRegThumbsUp className="thumb-up" />
              </button>
              <p>Upvote: {post.upvote}</p>
            </div>

            {/* only shows edit and delete buttons when the uid from Post equal to current session's id */}
            {session.user.id === post.uid && (
              <div>
                <Link to={`/edit/${post.id}`}>
                  <FaEdit className="edit-link" />
                </Link>
                <button className="delete-btn" onClick={deletePost}>
                  <RiDeleteBin6Line />
                </button>
                {/*Delete the post */}
              </div>
            )}
          </div>
        </div>

        <Comment
          comments={comments}
          setComments={setComments}
          setPost={setPost}
          post={post}
          id={id}
        />
      </div>
    </>
  );
};

export default ViewPost;
