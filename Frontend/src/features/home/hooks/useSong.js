// src/hooks/useSong.js
import { useContext } from "react";
import { SongContext } from "../song.context";
import {  uploadSongAPI,
  getSongAPI,
  getUploadStatusAPI,} from "../service/song.api";

export const useSong = () => {
  const {
    playlist,
    setPlaylist,
    currentSong,
    setCurrentSong,
    uploadStatus,
    setUploadStatus,
    loading,
    setLoading,
  } = useContext(SongContext);

  // 🎵 Upload Song
  const uploadSong = async (file, mood) => {
    if (!file || !mood) return alert("Missing fields");

    const formData = new FormData();
    formData.append("song", file); // ⚠️ MUST match backend
    formData.append("mood", mood);

    try {
      setLoading(true);

      const res = await uploadSongAPI(formData);
      const tempId = res.data.data.tempId;

      // 🔄 Polling
      const interval = setInterval(async () => {
        const statusRes = await getUploadStatusAPI(tempId);
        const status = statusRes.data.data.status;

        setUploadStatus(status);

        if (status === "completed") {
          clearInterval(interval);
          setLoading(false);
          alert("✅ Song uploaded successfully!");
        }

        if (status === "failed") {
          clearInterval(interval);
          setLoading(false);
          alert("❌ Upload failed!");
        }
      }, 2000);

    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // 🎧 Fetch Songs
  const fetchSongs = async (mood) => {
    try {
      setLoading(true);

      const res = await getSongAPI(mood);

      setPlaylist(res.data.data.playlist);
      setCurrentSong(res.data.data.currentSong);

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // 🔄 Play Next Random
  const playNextRandom = () => {
    if (!playlist.length) return;

    const random =
      playlist[Math.floor(Math.random() * playlist.length)];

    setCurrentSong(random);
  };

  return {
    playlist,
    currentSong,
    uploadStatus,
    loading,
    uploadSong,
    fetchSongs,
    playNextRandom,
  };
};