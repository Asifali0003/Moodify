// src/components/Playlist.jsx
import { useSong } from "../hooks/useSong";

export default function Playlist() {
  const { playlist } = useSong();

  return (
    <div>
      <h3>Playlist</h3>

      {playlist.map((song) => (
        <p key={song._id}>
          {song.title} - {song.artist}
        </p>
      ))}
    </div>
  );
}