import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { supabase } from "../client";
import { getTimeAgo } from "../utils";

const Profile = () => {
  const { session } = UserAuth();
  const [ownPost, setOwnPost] = useState([]);
  const navigate = useNavigate();

  // fetch the post based on session.user.id
  useEffect(() => {
    const fetchOwnPost = async () => {
      const { data } = await supabase
        .from("Post")
        .select()
        .eq("uid", session.user.id);

      setOwnPost(data);
    };
    fetchOwnPost();
  }, []);

  return (
    <>
      <div className="posts-content">
        <h1>Your Posts </h1>
        {ownPost.length > 0 ? (
          <div>
            {/* map each post on the screen */}
            {ownPost.map((post, index) => {
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
          <h1 className="no-post">No post yet...</h1>
        )}
      </div>
    </>
  );
};

export default Profile;
