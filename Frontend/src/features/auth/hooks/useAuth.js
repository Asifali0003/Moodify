// src/hooks/useAuth.js
import { register, login, getme, logout } from "../services/auth.api";
import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";

export const useAuth = () => {
  const context = useContext(AuthContext);

  const { user, setUser, loading, setLoading } = context;

  // ---------------------- REGISTER ----------------------
  async function handleRegister({ username, email, password }) {
    try {
      setLoading(true);

      const data = await register({ username, email, password });

      setUser(data.user || data.data?.user);

    } catch (err) {
      console.error("REGISTER ERROR:", err.response?.data);
    } finally {
      setLoading(false);
    }
  }

  // ---------------------- LOGIN ----------------------
  async function handleLogin({ email, password }) {
    try {
      setLoading(true);

      console.log("LOGIN PAYLOAD:", { email, password });

      const data = await login({ email, password });

      console.log("RESPONSE:", data);

      // ✅ SAVE TOKEN (MAIN FIX)
      const token = data.data?.token || data.token;

      if (token) {
        localStorage.setItem("token", token);
        console.log("✅ Token saved:", token);
      } else {
        console.log("❌ Token not found in response");
      }

      // ✅ SET USER
      setUser(data.user || data.data?.user);

    } catch (err) {
      console.error("LOGIN ERROR:", err.response?.data);
    } finally {
      setLoading(false);
    }
  }

  // ---------------------- GET ME ----------------------
  async function handleGetMe() {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      // 🚫 If no token → skip API
      if (!token) {
        setUser(null);
        return;
      }

      const data = await getme();

      setUser(data.user || data.data?.user);

    } catch (err) {
      console.error("GET ME ERROR:", err.response?.data);

      // ❌ Token invalid → auto logout
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        setUser(null);
      }

    } finally {
      setLoading(false);
    }
  }

  // ---------------------- LOGOUT ----------------------
  async function handleLogOut() {
    try {
      setLoading(true);

      await logout();

      // ✅ REMOVE TOKEN
      localStorage.removeItem("token");

      setUser(null);

    } catch (err) {
      console.error("LOGOUT ERROR:", err.response?.data);
    } finally {
      setLoading(false);
    }
  }

  // ---------------------- AUTO FETCH USER ----------------------
  useEffect(() => {
    const fetchUser = async () => {
      if (user) return;

      try {
        await handleGetMe();
      } catch (err) {
        console.error(err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return {
    user,
    loading,
    handleRegister,
    handleLogin,
    handleGetMe,
    handleLogOut,
  };
};