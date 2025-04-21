import { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "../client";

// Create authentication context
const AuthContext = createContext();

// Auth context provider component that wraps your app
export const AuthContextProvider = ({ children }) => {
  // State to store the current user session
  const [session, setSession] = useState(null);

  //   Sign Up function
  const signUp = async (email, password) => {
    // Call Supabase auth API to register new user
    const { data, error } = await supabase.auth.signUp({
      email: email.toLowerCase(),
      password: password,
    });

    if (error) {
      console.error("Error signing up:", error);
    }

    return { success: true };
  };

  //   Sign in
  const signIn = async (email, password) => {
    // Call Supabase auth API to log in user
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase(),
      password: password,
    });

    if (error) {
      console.error("Sign in error:", error);
    }

    return { success: true };
  };

  // Effect to handle session state changes
  useEffect(() => {
    // Check for existing session when component mounts
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Check for existing session when components
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  //   Sign out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out", error);
    }
  };

  // Provide auth functions and session state to children
  return (
    <AuthContext.Provider value={{ session, signUp, signIn, signOut }}>
      {children}{" "}
    </AuthContext.Provider>
  );
};

// Custom hook to easily access auth context
export const UserAuth = () => {
  return useContext(AuthContext);
};
