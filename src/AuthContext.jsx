import { createContext, useContext, useState } from "react";

const API = "https://fsa-jwt-practice.herokuapp.com";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState();
  const [location, setLocation] = useState("GATE");
  const [message, setMessage] = useState("");

  const signup = async (username) => {
    try {
      const req = await fetch(`${API}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
        }),
      });

      const res = await req.json();

      if (!req.ok) {
        throw new Error(res.message);
      }

      setToken(res.token);
      setMessage(res.message);
      setLocation("TABLET");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const authenticate = async () => {
    if (!token) {
      throw new Error("No token found");
    }

    try {
      const req = await fetch(`${API}/authenticate`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await req.json();

      if (!req.ok) {
        throw new Error(res.message);
      }

      setMessage(res.message);
      setLocation("TUNNEL");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const value = {
    location,
    signup,
    authenticate,
    message,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
