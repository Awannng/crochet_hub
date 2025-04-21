import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import CreatePost from "../pages/CreatePost.jsx";
import EditPost from "../pages/EditPost.jsx";
import ViewPost from "../pages/ViewPost.jsx";
import HomePage from "../pages/HomePage.jsx";
import SignIn from "../pages/SignIn.jsx";
import SignUp from "../pages/SignUp.jsx";
import Profile from "../pages/Profile.jsx";
import { AuthContextProvider } from "../context/AuthContext.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* declaring paths to the pages */}
    <BrowserRouter>
      <AuthContextProvider>
        <Routes>
          <Route index path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />

          {/* The homepage path, ProtectedRoute are there for for sign in check, if there is a session, it can go to the homepage.
          Only the parent routes needed to be wrapped, and the children routes are not able to be access unless it's in the parent's route*/}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <App />
              </ProtectedRoute>
            }
          >
            {/* the default page that shows on first render */}
            <Route index element={<HomePage />} />

            {/* the create new post page */}
            <Route path="/create" element={<CreatePost />} />

            {/* The edit post page where it edits a specific post based on id */}
            <Route path="/edit/:id" element={<EditPost />} />

            {/* the more details page about the post */}
            <Route path="/view/:id" element={<ViewPost />} />

            {/* the profile pahe that shows own posts*/}
            <Route path="/profile" element={<Profile />} />
          </Route>
          {/* The create post page */}
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>
);
