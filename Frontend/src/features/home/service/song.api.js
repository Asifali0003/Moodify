// src/api/song.api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true
});

// // 🔐 Attach token (if using auth)
// API.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// 🎵 Upload Song
export const uploadSongAPI = (formData) =>
  API.post("/songs/upload", formData);

// 🎧 Get Songs
export const getSongAPI = (mood) =>
  API.get(`/songs${mood ? `?mood=${mood}` : ""}`);

// 🔍 Get Upload Status
export const getUploadStatusAPI = (id) =>
  API.get(`/songs/status/${id}`);