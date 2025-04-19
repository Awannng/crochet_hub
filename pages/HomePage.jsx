import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../client";

const HomePage = () => {
  // storing post where fetch the data from the backend database
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState();
  const navigate = useNavigate();

  // fetch the post data from the database
  useEffect(() => {
    const fetchPost = async () => {
      if (search == "date") {
        // order the data based on date, from newest to oldest
        const { data } = await supabase
          .from("Post")
          .select()
          .order("created_at", { ascending: false });
        setPosts(data);
      } else if (search == "upvote") {
        //  order the data based on upvote counts, highest to lowest
        const { data } = await supabase
          .from("Post")
          .select()
          .order("upvote", { ascending: false });
        setPosts(data);
      } else {
        // order the data based on date, from oldest to newest
        const { data } = await supabase
          .from("Post")
          .select()
          .order("created_at", { ascending: true });
        setPosts(data);
      }
    };
    fetchPost();
  }, [search]);

  // calculate how many time ago the post had been posted
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1)
      return `${interval} year${interval === 1 ? "" : "s"} ago`;

    interval = Math.floor(seconds / 2592000);
    if (interval >= 1)
      return `${interval} month${interval === 1 ? "" : "s"} ago`;

    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval} day${interval === 1 ? "" : "s"} ago`;

    interval = Math.floor(seconds / 3600);
    if (interval >= 1)
      return `${interval} hour${interval === 1 ? "" : "s"} ago`;

    interval = Math.floor(seconds / 60);
    if (interval >= 1)
      return `${interval} minute${interval === 1 ? "" : "s"} ago`;

    return "just now";
  };

  return (
    <>
      <div className="posts-content">
        <div className="view-ways">
          <h3>Order by:</h3>
          <button
            name="upvote"
            value="upvote"
            onClick={(e) => setSearch(e.target.value)}
          >
            Upvote
          </button>
          <button
            name="date"
            value="date"
            onClick={(e) => setSearch(e.target.value)}
          >
            Date
          </button>
        </div>

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
                  <i>{getTimeAgo(post.created_at)}</i>
                  <div className="post-heading">
                    <h1>{post.title}</h1>
                    <p>{post.created_at.substring(0, 10)}</p>
                  </div>

                  <p>Author: {post.author}</p>
                  <p>Upvote: {post.upvote}</p>
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
