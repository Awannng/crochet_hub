import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../client";

const CreatePost = () => {
  const navigate = useNavigate(); //a function to direct path

  // storing the post information and send it to backend database
  const [postInfo, setPostInfo] = useState({
    title: "",
    author: "",
    description: "",
  });

  // change the when typing in the form
  const handleChange = (e) => {
    const { value, name } = e.target;
    setPostInfo((prev) => {
      return { ...prev, [name]: value };
    });
  };

  // creates a post in the database
  const createPost = async (e) => {
    e.preventDefault();

    await supabase
      .from("Post")
      .insert({
        title: postInfo.title,
        author: postInfo.author,
        description: postInfo.description,
      })
      .select();

    navigate("/"); //after submitting the form, it goes back to the homepage
  };
  return (
    <>
      Create Post
      <form>
        <label htmlFor="title">Title</label> <br />
        <input type="text" id="title" name="title" onChange={handleChange} />
        <br />
        <label htmlFor="author">Author</label> <br />
        <input type="text" id="author" name="author" onChange={handleChange} />
        <br />
        <label htmlFor="description">Description</label> <br />
        <textarea
          type="text"
          id="description"
          name="description"
          rows={5}
          cols={20}
          onChange={handleChange}
        />
        <br />
        <input type="submit" value="Submit" onClick={createPost} />
      </form>
      <Link to="/">Back</Link>
    </>
  );
};

export default CreatePost;
