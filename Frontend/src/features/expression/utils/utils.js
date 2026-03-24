// src/utils/utils.js
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

let stableCount = 0;
let lastExpression = "";

/**
 * Initialize MediaPipe + Camera
 */
export const init = async ({ landmarkerRef, videoRef, streamRef }) => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
  );

  landmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
    },
    outputFaceBlendshapes: true,
    runningMode: "VIDEO",
    numFaces: 1,
  });

  // small delay for stability
  await new Promise((resolve) => setTimeout(resolve, 100));

  // 🎥 Start camera
  streamRef.current = await navigator.mediaDevices.getUserMedia({ video: true });
  const video = videoRef.current;
  video.srcObject = streamRef.current;

  return new Promise((resolve) => {
    video.onloadedmetadata = () => video.play();
    video.onplaying = () => resolve();
  });
};

/**
 * Detect expression (ONE RUN LOOP)
 */
export const detect = ({
  landmarkerRef,
  videoRef,
  animationRef,
  setExpression,
  setIsDetecting,
  onDetected,
}) => {
  if (!landmarkerRef.current || !videoRef.current) return;

  const results = landmarkerRef.current.detectForVideo(
    videoRef.current,
    performance.now()
  );

  if (results.faceBlendshapes?.length > 0) {
    const blendshapes = results.faceBlendshapes[0].categories;

    const getScore = (name) =>
      blendshapes.find((b) => b.categoryName === name)?.score || 0;

    const smile =
      (getScore("mouthSmileLeft") + getScore("mouthSmileRight")) / 2;
    const frown =
      (getScore("mouthFrownLeft") + getScore("mouthFrownRight")) / 2;
    const jawOpen = getScore("jawOpen");

    let currentExpression = "neutral";

    if (smile > 0.5) currentExpression = "happy";
    else if (frown > 0.01) currentExpression = "sad";
    else if (jawOpen > 0.3) currentExpression = "surprised";

    setExpression(currentExpression);

    // ✅ Stability check
    if (currentExpression === lastExpression) {
      stableCount++;
    } else {
      stableCount = 0;
      lastExpression = currentExpression;
    }

    // 🎯 FINAL DETECTION
    if (stableCount > 10) {
      setIsDetecting(false);

      // 🛑 STOP LOOP COMPLETELY
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }

      stableCount = 0;
      lastExpression = "";

      if (typeof onDetected === "function") {
        onDetected(currentExpression.toLowerCase());
      }

      return;
    }
  }

  // 🔄 Continue loop
  animationRef.current = requestAnimationFrame(() =>
    detect({
      landmarkerRef,
      videoRef,
      animationRef,
      setExpression,
      setIsDetecting,
      onDetected,
    })
  );
};