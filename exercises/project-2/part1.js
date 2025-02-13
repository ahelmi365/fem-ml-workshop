const path = "./my_model/";

const startButton = document.getElementById("start");

let model, webcam;
const init = async () => {
  const modelPath = path + "model.json";
  console.log({ modelPath });
  const metadataPath = path + "metadata.json";
  console.log({ metadataPath });

  model = await tmImage.load(modelPath, metadataPath);
  console.log({ model });
  //   let maxPredictions = model.getTotalCalsses();

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    webcam = new tmImage.Webcam(200, 200, false);

    await webcam.setup();
    await webcam.play();

    window.requestAnimationFrame(loop);
    document.getElementById("webcam-container").appendChild(webcam.canvas);
  } else {
    console.error(
      "Your browser does not support WebRTC. Please try another one."
    );
  }
};

const loop = async () => {
  webcam.update();
  await predict();
  window.requestAnimationFrame(loop);
};

const predict = async () => {
  const predictions = await model.predict(webcam.canvas);
  console.log(predictions);
};

startButton.onclick = () => init();
