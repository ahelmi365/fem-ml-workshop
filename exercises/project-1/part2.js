import "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import { drawFaceBox, startWebcam, takePicture } from "./utils";

const webcamButton = document.getElementById("webcam");
const captureButton = document.getElementById("pause");
const video = document.querySelector("video");

let model;

const init = async () => {
  model = await cocoSsd.load();
};

webcamButton.onclick = () => startWebcam(video);
captureButton.onclick = () => takePicture(video, predict);

const predict = async (img) => {
  const prediction = await model.detect(img);
  console.log({ prediction });
  drawFaceBox(img, prediction.faces);
};

init();
