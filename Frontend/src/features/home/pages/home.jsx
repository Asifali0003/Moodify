// src/pages/Home.jsx
import React from "react";
import FaceExpression from "../../expression/components/FaceExpression";
import Player from "../components/Player";
import Playlist from "../components/Playlist";

const Home = () => {
  return (
    <>
      {/* 🎯 AI Mood Detection */}
      <FaceExpression />

      {/* 🎧 Music Player */}
      <Player />

      {/* 📃 Playlist */}
      <Playlist />
    </>
  );
};

export default Home;