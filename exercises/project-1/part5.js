import "@tensorflow/tfjs-backend-webgl";
// import "@mediapipe/face_detection";
import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs";

import * as faceDetection from "@tensorflow-models/face-detection";

import {
  drawFaceBox,
  drawFaceKeypoints,
  startWebcam,
  takePicture,
} from "./utils5";

const webcamButton = document.getElementById("webcam");
const captureButton = document.getElementById("pause");
const video = document.querySelector("video");
const status = document.getElementById("status");
const showBox = document.getElementById("show-box");
const showFaceKeypoints = document.getElementById("show-face-keypoints");

let showBoxValue = false;
let showFaceKeypointsValue = false;
let model, detector;

const init = async () => {
  model = faceDetection.SupportedModels.MediaPipeFaceDetector;
  detector = await faceDetection.createDetector(model, {
    runtime: "tfjs",
  });
};

const setupEventListeners = () => {
  webcamButton.onclick = () => startWebcam(video, predict);
  // captureButton.onclick = () => takePicture(video, predict);

  showBox.onclick = toggleShowBox;
  showFaceKeypoints.onclick = toggleShowFaceKeypoints;
};

const toggleShowBox = () => {
  showBoxValue = !showBoxValue;
};

const toggleShowFaceKeypoints = () => {
  showFaceKeypointsValue = !showFaceKeypointsValue;
};

const throttle = (func, limit) => {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

const predict = async (img) => {
  const faces = await detector.estimateFaces(img, {
    flipHorizontal: false,
  });

  updateStatus(faces.length);

  if (showBoxValue) {
    drawFaceBox(img, faces);
  }
  if (showFaceKeypointsValue) {
    drawFaceKeypoints(img, faces);
  }
};

const throttledPredict = throttle(predict, 100);

const updateStatus = (faceCount) => {
  if (faceCount === 0) {
    status.innerText = "No face detected, try again";
    status.style.backgroundColor = "red";
  } else {
    status.innerText = "Face detected";
    status.style.backgroundColor = "green";
  }
};

init().then(setupEventListeners);
