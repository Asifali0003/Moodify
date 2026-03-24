// src/components/FaceExpression.jsx
import { useEffect, useRef, useState } from "react";
import { init, detect } from "../utils/utils";
import { useSong } from "../../home/hooks/useSong";
import "../style/faceExpression.scss";

export default function FaceExpression() {
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);
  const animationRef = useRef(null);
  const streamRef = useRef(null);

  const { fetchSongs } = useSong();

  const [expression, setExpression] = useState("Initializing...");
  const [isDetecting, setIsDetecting] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // ✅ Initialize camera
  useEffect(() => {
    let mounted = true;

    const setup = async () => {
      try {
        await init({ landmarkerRef, videoRef, streamRef });

        if (mounted) {
          setExpression("Ready");
          setIsReady(true);
        }
      } catch (err) {
        console.error("Initialization error:", err);
        setExpression("Camera Error");
      }
    };

    setup();

    return () => {
      mounted = false;

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }

      if (landmarkerRef.current) {
        landmarkerRef.current.close();
      }

      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  // ✅ Start detection (ONE CLICK = ONE DETECT)
  const startDetection = () => {
    if (!isReady || isDetecting) return;

    setIsDetecting(true);
    setExpression("Detecting...");

    const runDetection = () => {
      detect({
        landmarkerRef,
        videoRef,
        animationRef,
        setExpression,
        setIsDetecting,

        // 🎯 FINAL RESULT CALLBACK
        onDetected: (mood) => {
          console.log("🎯 Detected Mood:", mood);

          // 🛑 Stop loop completely
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
          }

          // ✅ Reset state
          setIsDetecting(false);
          setExpression(`Detected: ${mood}`);

          // 🎧 Fetch songs
          fetchSongs(mood);
        },
      });
    };

    if (videoRef.current.readyState >= 2) {
      runDetection();
    } else {
      videoRef.current.onplaying = () => runDetection();
    }
  };

  return (
    <section className="face-expression">
      <div className="face-expression__card">

        {/* Status */}
        <div className="face-expression__header">
          <span className="face-expression__status">
            {isDetecting
              ? "Scanning..."
              : isReady
              ? "Ready"
              : "Initializing"}
          </span>
        </div>

        {/* Video */}
        <div className="face-expression__video">
          <video ref={videoRef} playsInline />
          <div className="face-expression__overlay">
            <p>{expression}</p>
          </div>
        </div>

        {/* Button */}
        <div className="face-expression__actions">
          <button
            type="button"
            onClick={startDetection}
            disabled={!isReady || isDetecting}
          >
            {isDetecting ? "Detecting..." : "Detect Face"}
          </button>

          <p className="face-expression__hint">
            Keep your face centered and hold still.
          </p>
        </div>
      </div>
    </section>
  );
}