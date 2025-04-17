import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./App.css";
import { supabase } from "../client";

function App() {
  // storing post where fetch the data from the backend database
  const [posts, setPosts] = useState([]);

  // fetch the post data from the database
  useEffect(() => {
    const fetchPost = async () => {
      const { data } = await supabase
        .from("Post")
        .select()
        .order("created_at", { ascending: true });

      setPosts(data);
    };
    fetchPost();
  }, []);

  return (
    <>
      <Link to="/create">Create Post</Link>
      {/* map each post on the screen */}
      {posts &&
        posts.map((post, index) => {
          return (
            <div key={index} className="post-container">
              <p>{post.title}</p>
              <p>{post.created_at.substring(0, 10)}</p>
              <p>{post.author}</p>
              <p>{post.description}</p>
              <Link to={`/edit/${post.id}`}>Edit</Link>
            </div>
          );
        })}
    </>
  );
}

export default App;
