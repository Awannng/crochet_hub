import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { signIn } = UserAuth();

  // When click in Sign In button, it logins into the web
  const handleSignIn = async (e) => {
    e.preventDefault();

    const result = await signIn(email, password);
    if (result.success) {
      navigate("/");
    } else {
      console.error(result.error.message);
    }
  };

  return (
    <>
      <div className="sign-form">
        <h1 className="sign-title">Crochet Hub</h1>
        <form onSubmit={handleSignIn}>
          <input
            className="form-item"
            type="text"
            id="email"
            name="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="form-item"
            type="text"
            id="password"
            name="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="submit-item">
            <input type="submit" value="Sign In" />
          </div>
        </form>

        <p className="sign-p">
          Don't have an account yet? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </>
  );
};

export default SignIn;
