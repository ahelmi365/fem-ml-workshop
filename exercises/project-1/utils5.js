// Part 1
// -----------

export const showResult = (classes) => {
  const predictionsElement = document.getElementById("predictions");
  predictionsElement.innerHTML = ""; // Clear previous predictions
  classes.forEach(({ class: className, score }) => {
    const probsContainer = document.createElement("div");
    probsContainer.innerText = `Prediction: ${className}, Probability: ${score}`;
    predictionsElement.appendChild(probsContainer);
  });
};

// Set a consistent image size for processing
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
      video.onloadedmetadata = () => video.play();
      video.style.display = "none";
      setInterval(() => {
        drawCanvasFromVideo(video);
        callback(canvas);
      }, 30);
    })
    .catch((err) => {
      console.error("Error accessing webcam: ", err);
    });
};

export const takePicture = (video, callback) => {
  const predictButton = document.getElementById("predict");
  const canvas = document.getElementById("canvas");
  const width = IMAGE_SIZE; // We will scale the photo width to this
  const height = IMAGE_SIZE;
  const context = canvas.getContext("2d");
  canvas.width = width;
  canvas.height = height;
  context.drawImage(video, 0, 0, width, height);

  const outputEl = document.getElementById("predictions");
  outputEl.innerHTML = ""; // Clear previous canvas
  outputEl.appendChild(canvas);

  predictButton.disabled = false;

  predictButton.onclick = async () => {
    await callback(canvas);
  };
};

// Part 3
// -----------

export const drawFaceBox = (photo, faces) => {
  if (faces.length === 0 || faces[0].box === undefined) {
    return;
  }

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
  webcamSection.appendChild(faceCanvas);
  setTimeout(() => {
    webcamSection.removeChild(faceCanvas);
  }, 30);
};

export const drawFaceKeypoints = (photo, faces) => {
  const keypointsCanvas = createCanvas(photo);
  const ctx = keypointsCanvas.getContext("2d");

  ctx.fillStyle = "blue";
  faces.forEach((face) => {
    face.keypoints.forEach((keypoint) => {
      ctx.beginPath();
      ctx.arc(keypoint.x, keypoint.y, 3, 0, 2 * Math.PI);
      ctx.fill();
    });
  });

  const webcamSection = document.getElementById("webcam-section");
  webcamSection.appendChild(keypointsCanvas);
  setTimeout(() => {
    webcamSection.removeChild(keypointsCanvas);
  }, 30);
};

const drawCanvasFromVideo = (video) => {
  const canvas = document.getElementById("canvas");
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
  canvas.style.left = photo.offsetLeft + "px";
  canvas.style.top = photo.offsetTop + "px";
  return canvas;
};
