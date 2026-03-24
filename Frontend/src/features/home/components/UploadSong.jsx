// src/components/UploadSong.jsx
import { useState } from "react";
import { useSong } from "../hooks/useSong";

export default function UploadSong() {
  const [file, setFile] = useState(null);
  const [mood, setMood] = useState("");

  const { uploadSong, uploadStatus, loading } = useSong();

  return (
    <div>
      <h3>Upload Song</h3>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <input
        type="text"
        placeholder="Enter mood"
        onChange={(e) => setMood(e.target.value)}
      />

      <button onClick={() => uploadSong(file, mood)}>
        {loading ? "Uploading..." : "Upload"}
      </button>

      {uploadStatus && <p>Status: {uploadStatus}</p>}
    </div>
  );
}