import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { supabase } from "../client";

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
      
      ViewPost
      <div className="view-post">
        <p>{post.title}</p>
        <p>{String(post.created_at).substring(0, 10)}</p>
        <p>{post.author}</p>
        <p>{post.description}</p>
        <Link to={`/edit/${post.id}`}>Edit</Link>
        <button onClick={deletePost}>Delete</button> {/*Delete the post */}
      </div>
      <Link to="/">Back</Link>
    </>
  );
};

export default ViewPost;
