import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";


export const init = async ({landmarkerRef,videoRef,streamRef}) => {
    const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );

  landmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task"
    },
    outputFaceBlendshapes: true,
    runningMode: "VIDEO",
    numFaces: 1
  });

  streamRef.current = await navigator.mediaDevices.getUserMedia({ video: true });

  const video = videoRef.current;
  video.srcObject = streamRef.current;

  video.onloadedmetadata = () => {
    video.play();
  }; 
}

export const detect = ({landmarkerRef,videoRef,animationRef,setExpression,setIsDetecting}) => {
  if (!landmarkerRef.current || !videoRef.current) return;

  const results = landmarkerRef.current.detectForVideo(
    videoRef.current,
    performance.now()
  );

  if (results.faceBlendshapes?.length > 0) {
    const blendshapes = results.faceBlendshapes[0].categories;

    const getScore = (name) =>
      blendshapes.find((b) => b.categoryName === name)?.score || 0;

    const smileLeft = getScore("mouthSmileLeft");
    const smileRight = getScore("mouthSmileRight");
    const jawOpen = getScore("jawOpen");
    const browUp = getScore("browInnerUp");
    const frownLeft = getScore("mouthFrownLeft");
    const frownRight = getScore("mouthFrownRight");

    // console.log("Sad expression value →", frownLeft, frownRight);

    let currentExpression = "Neutral";

    if (smileLeft > 0.5 && smileRight > 0.5) {
      currentExpression = "Happy 😄";
    } else if (jawOpen > 0.2 && browUp > 0.2) {
      currentExpression = "Surprised 😲";
    } else if (frownLeft > 0.003 && frownRight > 0.003) {
      currentExpression = "Sad 😢";
    }

    setExpression(currentExpression);

    // 🛑 Stop detecting after one expression
    cancelAnimationFrame(animationRef.current);
    setIsDetecting(false);

    return;
  }

  animationRef.current = requestAnimationFrame(() => detect({
    landmarkerRef,
    videoRef,
    animationRef,
    setExpression,
    setIsDetecting
  }));
};