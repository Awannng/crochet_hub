import React, { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { supabase } from "../client";
import { IoPlayBackSharp } from "react-icons/io5";
import { uploadImage } from "../utils";

const EditPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState({
    title: "",
    author: "",
    description: "",
    imageUrl: "",
  });
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

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

  // update the post in the database, can edit even if the image file is empty
  const editPost = async (e) => {
    e.preventDefault();

    // initial imageUrl to the uploaded image
    let imageURL = post.imageUrl;

    // Use the ref to access the file input
    const file = fileInputRef.current?.files?.[0];
    //if the file is not empty
    if (file) {
      imageURL = await uploadImage(file); //get image url from supabse storage

      // if the updated image is not the same, delete the previous image from database
      if (post.imageUrl && post.imageUrl !== imageURL) {
        const imgArr = String(post.imageUrl).split("/");
        await supabase.storage
          .from("post-image")
          .remove([`images/${imgArr[9]}`]);
      }
    }

    await supabase
      .from("Post")
      .update({
        title: post.title,
        author: post.author,
        description: post.description,
        imageUrl: imageURL,
      })
      .eq("id", id);

    navigate(`/view/${id}`); //go back go view page
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

          <div className="form-item">
            <label htmlFor="image">Image (JPEG, PNG, ect...)</label> <br />
            <input
              ref={fileInputRef}
              type="file"
              id="image"
              name="image"
              accept="image/*"
            />
            {/* shows the current image that was being uploaded */}
            {post.imageUrl && (
              <div className="current-image">
                <p>Current Image:</p>
                <img
                  src={post.imageUrl}
                  alt="Current post"
                  style={{ maxWidth: "200px" }}
                />
              </div>
            )}
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
