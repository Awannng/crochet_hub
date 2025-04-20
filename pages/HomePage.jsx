import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../client";
import { getTimeAgo } from "../utils";

const HomePage = () => {
  // storing post where fetch the data from the backend database
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const navigate = useNavigate();

  // fetch the post data from the database
  useEffect(() => {
    const fetchPost = async () => {
      let query = supabase.from("Post").select();

      // apply sorting
      if (sort === "date") {
        // order the data based on date, from newest to oldest
        query = query.order("created_at", { ascending: false });
      } else if (sort === "upvote") {
        //  order the data based on upvote counts, highest to lowest
        query = query.order("upvote", { ascending: false });
      } else {
        // order the data based on date, from oldest to newest
        query = query.order("created_at", { ascending: true });
      }

      //fetch the database
      const { data } = await query;

      let filteredData = data;
      // checks if search is not empty, search by title or author
      if (search.trim() !== "") {
        filteredData = data.filter(
          (post) =>
            post.title.toLowerCase().includes(search.toLowerCase()) ||
            post.author.toLowerCase().includes(search.toLowerCase())
        );
      }
      setPosts(filteredData);
    };
    fetchPost();
  }, [search, sort]);

  return (
    <>
      <div className="posts-content">
        <div>
          <input
            type="text"
            name="value"
            placeholder="search by title or author"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="sort-ways">
          <h3>Order by:</h3>
          <button
            className={sort === "upvote" ? "selected" : "not-selected"}
            name="upvote"
            value="upvote"
            onClick={(e) => setSort(e.target.value)}
          >
            Upvote
          </button>
          <button
            className={sort === "date" ? "selected" : "not-selected"}
            name="date"
            value="date"
            onClick={(e) => setSort(e.target.value)}
          >
            Newest Date
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
