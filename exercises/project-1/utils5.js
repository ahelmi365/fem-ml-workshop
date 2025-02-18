// Part 1
// -----------

export const showResult = (classes) => {
  const predictionsElement = document.getElementById("predictions");
  const probsContainer = document.createElement("div");
  for (let i = 0; i < classes.length; i++) {
    probsContainer.innerText = `Prediction: ${classes[i].class}, Probability: ${classes[i].score}`;
  }
  // predictionsElement.innerHTML = ""; // Clear previous predictions
  predictionsElement.appendChild(probsContainer);
};

// export const IMAGE_SIZE = 224;
export const IMAGE_SIZE = 400;

// Part 2
// -----------

export const startWebcam = (video, callback) => {
  return navigator.mediaDevices
    .getUserMedia({
      audio: false,
      video: { width: 320, height: 185 },
    })
    .then((stream) => {
      video.srcObject = stream;
      track = stream.getTracks()[0];
      video.onloadedmetadata = () => video.play();
      video.style.display = "none";
      setInterval(() => {
        drawCanvasFromVideo(video);
        callback(canvas);
      }, 30);
    })
    .catch((err) => {
      /* handle the error */
    });
};

export const takePicture = (video, callback) => {
  const predictButton = document.getElementById("predict");
  const canvas = document.getElementById("canvas");
  // const width = 320; // We will scale the photo width to this
  // const height = 185;
  const width = IMAGE_SIZE; // We will scale the photo width to this
  const height = IMAGE_SIZE;
  const context = canvas.getContext("2d");
  canvas.width = width;
  canvas.height = height;
  context.drawImage(video, 0, 0, width, height);

  const outputEl = document.getElementById("predictions");
  // outputEl.innerHTML = ""; // Clear previous canvas
  outputEl.appendChild(canvas);

  predictButton.disabled = false;

  predictButton.onclick = async () => {
    await callback(canvas);
  };
};

// Part 3
// -----------

export const drawFaceBox = (photo, faces) => {
  // console.log(photo);
  if (faces.length === 0) {
    return;
  }
  if (faces[0].box === undefined) {
    return;
  }

  if (faces.length > 1) {
    console.log(faces);
  }
  // Draw box around the face detected ⬇️
  // ------------------------------------
  const faceCanvas = createCanvas(photo);
  const ctx = faceCanvas.getContext("2d");
  ctx.beginPath();
  ctx.strokeStyle = "red";
  ctx.strokeRect(
    faces[0].box.xMin,
    faces[0].box.yMin,
    faces[0].box.width,
    faces[0].box.height
  );

  const webcamSection = document.getElementById("webcam-section");
  // webcamSection.innerHTML = ""; // Clear previous face boxes
  webcamSection.appendChild(faceCanvas);
  setTimeout(() => {
    webcamSection.removeChild(faceCanvas);
  }, 30);
};

export const drawFaceKeypoints = (photo, faces) => {
  const keypointsCanvas = createCanvas(photo);
  const ctx = keypointsCanvas.getContext("2d");

  ctx.fillStyle = "blue";
  // ctx.fillStyle = "red";
  faces.forEach((face) => {
    face.keypoints.forEach((keypoint) => {
      ctx.beginPath();
      ctx.arc(keypoint.x, keypoint.y, 3, 0, 2 * Math.PI);
      ctx.fill();
    });
  });

  const webcamSection = document.getElementById("webcam-section");
  // webcamSection.innerHTML = ""; // Clear previous keypoints
  webcamSection.appendChild(keypointsCanvas);
  setTimeout(() => {
    webcamSection.removeChild(keypointsCanvas);
  }, 30);
};

const drawCanvasFromVideo = (video) => {
  const canvas = document.getElementById("canvas");
  // const width = 320; // We will scale the photo width to this
  // const height = 185;
  const width = IMAGE_SIZE; // We will scale the photo width to this
  const height = IMAGE_SIZE;
  const context = canvas.getContext("2d");
  canvas.width = width;
  canvas.height = height;
  context.drawImage(video, 0, 0, width, height);

  const outputEl = document.getElementById("predictions");
  outputEl.innerHTML = ""; // Clear previous canvas
  outputEl.appendChild(canvas);
};

const createCanvas = (photo) => {
  const canvas = document.createElement("canvas");
  canvas.width = IMAGE_SIZE;
  canvas.height = IMAGE_SIZE;
  canvas.style.position = "absolute";
  canvas.style.left = photo.offsetLeft;
  canvas.style.top = photo.offsetTop;
  return canvas;
};
