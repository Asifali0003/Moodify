// src/context/song.context.jsx
import { createContext, useState } from "react";

export const SongContext = createContext();

export const SongProvider = ({ children }) => {
  const [playlist, setPlaylist] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <SongContext.Provider
      value={{
        playlist,
        setPlaylist,
        currentSong,
        setCurrentSong,
        uploadStatus,
        setUploadStatus,
        loading,
        setLoading,
      }}
    >
      {children}
    </SongContext.Provider>
  );
};