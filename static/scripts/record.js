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

  navigator.mediaDevices
    .getUserMedia(audioMediaConstraints)
    .then((mediaStream) => {
      console.log(mediaStream);
      const mediaRecorder = new MediaRecorder(mediaStream);
      window.mediaStream = mediaStream;
      window.mediaRecorder = mediaRecorder;

      mediaRecorder.start();
      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, {
          type: "audio/wav",
        });
        chunks = [];

        recordedMedia = document.createElement("audio");
        recordedMedia.controls = true;

        const recordedMediaURL = URL.createObjectURL(blob);

        recordedMedia.src = recordedMediaURL;

        document.getElementById(`vid-recorder`).append(recordedMedia);
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

function submit(thisbutton) {
  alert("Submitted");
}
