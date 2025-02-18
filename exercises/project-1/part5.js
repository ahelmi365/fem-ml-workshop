import "@tensorflow/tfjs";
// import "@mediapipe/face_detection";
import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";

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
let showBoxValue = false;
const showFaceKeypoints = document.getElementById("show-face-keypoints");
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
  showBox.onclick = () => {
    showBoxValue = !showBoxValue;
  };
  showFaceKeypoints.onclick = () => {
    showFaceKeypointsValue = !showFaceKeypointsValue;
  };
};

const predict = async (img) => {
  const faces = await detector.estimateFaces(img, {
    flipHorizontal: false,
  });

  if (faces.length === 0) {
    status.innerText = "No face detected, try again";
    status.style.backgroundColor = "red";
    // status.style.color = "white";
    // message.innerText = "Please try again";
    return;
  } else {
    status.innerText = "Face detected";
    status.style.backgroundColor = "green";
    // status.style.color = "white";
    // message.innerText = "";
  }

  // console.log({ faces });
  if (showBoxValue) {
    drawFaceBox(img, faces);
  }
  if (showFaceKeypointsValue) {
    drawFaceKeypoints(img, faces);
  }
};

init().then(setupEventListeners);
