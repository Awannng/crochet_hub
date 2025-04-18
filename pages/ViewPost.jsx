import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { supabase } from "../client";
import { IoPlayBackSharp } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";

const ViewPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState({ title: "", author: "", description: "" });

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
  }, []);

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
            <p>{post.description}</p>
          </div>

          <div className="post-buttons">
            <Link className="edit-link" to={`/edit/${post.id}`}>
              <FaEdit />
            </Link>
            <button onClick={deletePost}>
              <RiDeleteBin6Line />
            </button>
            {/*Delete the post */}
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewPost;
