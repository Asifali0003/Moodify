// src/components/Player.jsx
import { useEffect, useRef, useState } from "react";
import { useSong } from "../hooks/useSong";

export default function Player() {
  const { currentSong, playNextRandom } = useSong();
  const audioRef = useRef(null);

  const [speed, setSpeed] = useState(1);
  const [savedTime, setSavedTime] = useState(0);

  // ▶️ Autoplay + Resume from last paused time
  useEffect(() => {
    if (audioRef.current && currentSong) {
      audioRef.current.load();

      // Resume from saved time
      audioRef.current.currentTime = savedTime;

      audioRef.current.play();
    }
  }, [currentSong]);

  // ⏸️ Save current time when paused
  const handlePause = () => {
    if (audioRef.current) {
      setSavedTime(audioRef.current.currentTime);
    }
  };

  // ⏩ Forward 5 sec
  const forward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime += 5;
    }
  };

  // ⏪ Backward 5 sec
  const backward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime -= 5;
    }
  };

  // ⚡ Change speed
  const changeSpeed = (value) => {
    setSpeed(value);
    if (audioRef.current) {
      audioRef.current.playbackRate = value;
    }
  };

  if (!currentSong) return <p>No song playing</p>;

  return (
    <div>
      <h3>Now Playing 🎧</h3>
      <p>{currentSong.title} - {currentSong.artist}</p>

      <audio
        ref={audioRef}
        controls
        onPause={handlePause}
        onEnded={playNextRandom}
      >
        <source src={currentSong.url} type="audio/mpeg" />
      </audio>

      {/* 🎮 Controls */}
      <div style={{ marginTop: "10px" }}>
        <button onClick={backward}>⏪ -5s</button>
        <button onClick={forward}>⏩ +5s</button>
      </div>

      {/* ⚡ Speed Control */}
      <div style={{ marginTop: "10px" }}>
        <label>Speed: </label>
        <select
          value={speed}
          onChange={(e) => changeSpeed(Number(e.target.value))}
        >
          <option value={0.5}>0.5x</option>
          <option value={1}>1x</option>
          <option value={1.5}>1.5x</option>
          <option value={2}>2x</option>
        </select>
      </div>
    </div>
  );
}