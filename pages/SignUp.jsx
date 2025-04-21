import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { supabase } from "../client";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { session, signUp } = UserAuth();

  // when click on Sign Up button
  const handleSignUp = async (e) => {
    e.preventDefault();

    const result = await signUp(email, password);
    if (result.success) {
      // add the session info to User database
      await supabase
        .from("User")
        .insert({ uid: session.user.id, email: email })
        .select();

      // naviagte to homepage
      navigate("/");
    } else {
      console.error(result.error.message);
    }
  };

  return (
    <>
      <div className="sign-form">
        <h1 className="sign-title">Crochet Hub</h1>
        <form onSubmit={handleSignUp}>
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
            <input type="submit" value="Sign Up" />
          </div>
        </form>

        <p className="sign-p">
          Already have an account? <Link to="/signin">Sign In</Link>
        </p>
      </div>
    </>
  );
};

export default SignUp;
