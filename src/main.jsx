import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import CreatePost from "../pages/CreatePost.jsx";
import EditPost from "../pages/EditPost.jsx";
import ViewPost from "../pages/ViewPost.jsx";
import HomePage from "../pages/HomePage.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* declaring paths to the pages */}
    <BrowserRouter>
      <Routes>
        {/* The homepage path */}
        <Route path="/" element={<App />}>
          {/* the default page that shows on first render */}
          <Route index element={<HomePage />} />

          {/* the create new post page */}
          <Route path="/create" element={<CreatePost />} />

          {/* The edit post page where it edits a specific post based on id */}
          <Route path="/edit/:id" element={<EditPost />} />

          {/* the more details page about the post */}
          <Route path="/view/:id" element={<ViewPost />} />
        </Route>
        {/* The create post page */}
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
