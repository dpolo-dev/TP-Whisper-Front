import { useEffect } from "react";
import socket from "../services/socketService";
import { transcribeAndTranslateAudio } from "../services/azureService";
import { convertBlobToWav } from "../utils/audioConvert";

export function useTranscription(
  audioTracks,
  participant,
  selectedLanguage,
  selectedModel,
  handleNewTranscription
) {
  useEffect(() => {
    const audioTrack = audioTracks[0];

    if (audioTrack) {
      const stream = new MediaStream([audioTrack.mediaStreamTrack]);
      const mimeType = "audio/webm";
      const recorder = new MediaRecorder(stream, { mimeType });

      let intervalId;

      recorder.addEventListener("dataavailable", async (event) => {
        if (event.data.size > 0) {
          const audioBlob = new Blob([event.data], { type: mimeType });
          const wavBlob = await convertBlobToWav(audioBlob);
          const arrayBuffer = await wavBlob.arrayBuffer();

          if (selectedModel === "Whisper") {
            socket.emit("transcribe_audio", {
              participant: participant.identity,
              language: selectedLanguage,
              audioData: arrayBuffer,
              model: selectedModel,
            });
          } else if (selectedModel === "Azure") {
            try {
              const transcriptionResult = await transcribeAndTranslateAudio(
                audioBlob,
                selectedLanguage
              );

              handleNewTranscription(transcriptionResult);
            } catch (error) {
              console.error("Error during transcription:", error);
            }
          }
        }
      });

      recorder.start();

      intervalId = setInterval(() => {
        if (recorder.state === "recording") {
          recorder.stop();
          recorder.start();
        }
      }, 2500);

      return () => {
        clearInterval(intervalId);
        if (recorder.state !== "inactive") {
          recorder.stop();
        }
      };
    }
  }, [
    audioTracks,
    participant,
    selectedLanguage,
    selectedModel,
    handleNewTranscription,
  ]);
}
