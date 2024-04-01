const webcamElement = document.getElementById("webcam");
const canvasElement = document.getElementById("canvas");
const webcam = new Webcam(webcamElement);
webcam.start();

let chunks = [];

let recordedMedia = null;

const audioMediaConstraints = {
  audio: true,
  video: false,
};

const videoMediaConstraints = {
  audio: true,
  video: true,
};

function startRecording(thisButton, otherButton) {
  // Access the microphone
  chunks = [];

  navigator.mediaDevices
    .getUserMedia(audioMediaConstraints)
    .then((mediaStream) => {
      const mediaRecorder = new MediaRecorder(mediaStream);
      window.mediaStream = mediaStream;
      window.mediaRecorder = mediaRecorder;

      mediaRecorder.start();
      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        var blob = new Blob(chunks, {
          type: "audio/wav",
        });
        // chunks = [];

        recordedMedia = document.createElement("audio");
        recordedMedia.controls = true;

        const recordedMediaURL = URL.createObjectURL(blob);

        recordedMedia.src = recordedMediaURL;

        // document.getElementById(`vid-recorder`).append(recordedMedia);
      };

      document.getElementById(`vid-record-status`).innerText = "Recording";

      thisButton.disabled = true;
      otherButton.disabled = false;
    });
}

function stopRecording(thisButton, otherButton, submitbutton) {
  window.mediaRecorder.stop();

  window.mediaStream.getTracks().forEach((track) => {
    track.stop();
  });

  document.getElementById(`vid-record-status`).innerText = "Recording done!";
  thisButton.disabled = true;
  otherButton.disabled = false;
  submitbutton.disabled = false;
}

function submit(thisButton) {
  var blob = new Blob(chunks, {
    type: "audio/wav",
  });

  const formData = new FormData();
  formData.append("audio_data", blob, "file");
  formData.append("type", "wav");

  fetch("/submit", {
    method: "POST",
    cache: "no-cache",
    body: formData,
  }).then((response) => {
    if (response.ok) {
      console.log(response);
      // window.location.href = response.url;
    } else {
      console.error("Error saving audio:", response.statusText);
    }
  });
}
