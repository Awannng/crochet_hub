import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { supabase } from "../client";

const EditPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState({ title: "", author: "", description: "" });
  const navigate = useNavigate();

  // change when typing in the input box
  const handleChange = (e) => {
    const { value, name } = e.target;
    setPost((prev) => {
      return { ...prev, [name]: value };
    });
  };

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

  // update the post in the database
  const editPost = async (e) => {
    e.preventDefault();

    await supabase
      .from("Post")
      .update({
        title: post.title,
        author: post.author,
        description: post.description,
      })
      .eq("id", id);

    navigate("/"); //go back go homepage
  };
  return (
    <>
      Edit post
      <form>
        <label htmlFor="title">Title</label> <br />
        <input
          type="text"
          id="title"
          name="title"
          value={post.title}
          onChange={handleChange}
        />
        <br />
        <label htmlFor="author">Author</label> <br />
        <input
          type="text"
          id="author"
          name="author"
          value={post.author}
          onChange={handleChange}
        />
        <br />
        <label htmlFor="description">Description</label> <br />
        <textarea
          type="text"
          id="description"
          name="description"
          value={post.description}
          rows={5}
          cols={20}
          onChange={handleChange}
        />
        <br />
        <input type="submit" value="Submit" onClick={editPost} />
      </form>
      <Link to="/">Back</Link>
    </>
  );
};

export default EditPost;
