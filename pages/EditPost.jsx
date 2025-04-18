import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { supabase } from "../client";
import { IoPlayBackSharp } from "react-icons/io5";

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
      <div className="form-container">
        <Link className="back-link" to={`/view/${post.id}`}>
          <IoPlayBackSharp />
        </Link>
        <h2 className="edit-title">Edit post</h2>
        <form>
          <div className="form-item">
            <label htmlFor="title">Title</label> <br />
            <input
              type="text"
              id="title"
              name="title"
              value={post.title}
              onChange={handleChange}
            />
          </div>

          <div className="form-item">
            <label htmlFor="author">Author</label> <br />
            <input
              type="text"
              id="author"
              name="author"
              value={post.author}
              onChange={handleChange}
            />
          </div>

          <div className="form-item">
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
          </div>

          <div className="submit-item">
            <input type="submit" value="Submit" onClick={editPost} />
          </div>
        </form>
      </div>
    </>
  );
};

export default EditPost;
