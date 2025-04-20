import React, { useState, useRef} from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../client";
import { uploadImage } from "../utils";

const CreatePost = () => {
  const navigate = useNavigate(); //a function to direct path
  const fileInputRef = useRef(null);

  // storing the post information and send it to backend database
  const [postInfo, setPostInfo] = useState({
    title: "",
    author: "",
    description: "",
    imageUrl: "",
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

    // Use the ref to access the file input
    const file = fileInputRef.current?.files?.[0];
    const iamgeURL = await uploadImage(file); //get image url from supabse storage

    await supabase
      .from("Post")
      .insert({
        title: postInfo.title,
        author: postInfo.author,
        description: postInfo.description,
        upvote: 0,
        imageUrl: iamgeURL,
      })
      .select();

    navigate("/"); //after submitting the form, it goes back to the homepage
  };
  return (
    <>
      <div className="form-container">
        <h2 className="create-title">Create your post now!!</h2>
        <form>
          <div className="form-item">
            <label htmlFor="title">Title</label> <br />
            <input
              type="text"
              id="title"
              name="title"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-item">
            <label htmlFor="author">Author</label> <br />
            <input
              type="text"
              id="author"
              name="author"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-item">
            <label htmlFor="description">Description</label> <br />
            <textarea
              type="text"
              id="description"
              name="description"
              rows={5}
              cols={20}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-item">
            <label htmlFor="image">Image</label> <br />
            <input
              ref={fileInputRef}
              type="file"
              id="image"
              name="image"
              accept="image/*"
              required
            />
          </div>

          <div className="submit-item">
            <input type="submit" value="Submit" onClick={createPost} />
          </div>
        </form>
      </div>
    </>
  );
};

export default CreatePost;
