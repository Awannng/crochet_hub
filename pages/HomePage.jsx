import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../client";

const HomePage = () => {
  // storing post where fetch the data from the backend database
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

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
      <div className="posts-content">
        {posts.length > 0 ? (
          <div>
            {/* map each post on the screen */}
            {posts.map((post, index) => {
              return (
                <div
                  key={index}
                  className="post-container"
                  onClick={() => navigate(`/view/${post.id}`)}
                >
                  <div className="post-heading">
                    <h1>{post.title}</h1>
                    <p>{post.created_at.substring(0, 10)}</p>
                  </div>

                  <p>Author: {post.author}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <p>No post yet...</p>
        )}
      </div>
    </>
  );
};

export default HomePage;
