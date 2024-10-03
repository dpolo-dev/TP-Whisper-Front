/* eslint-disable react/prop-types */
import { useContext, useEffect, useRef, useState } from "react";
import socket from "../../services/socketService";
import { LanguageContext } from "../../context/LanguageContext";
import { convertBlobToWav } from "../../utils/audioConvert";

const Participant = ({ isLocal, participant }) => {
  const { selectedLanguage } = useContext(LanguageContext);

  const [videoTracks, setVideoTracks] = useState([]);
  const [audioTracks, setAudioTracks] = useState([]);
  const [transcriptions, setTranscriptions] = useState([]);
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  const trackSubscribed = (track) => {
    if (track.kind === "video") {
      setVideoTracks((prev) => [...prev, track]);
    } else if (track.kind === "audio") {
      setAudioTracks((prev) => [...prev, track]);
    }
  };

  const trackUnsubscribed = (track) => {
    if (track.kind === "video") {
      setVideoTracks((prev) => prev.filter((t) => t !== track));
    } else if (track.kind === "audio") {
      setAudioTracks((prev) => prev.filter((t) => t !== track));
    }
  };

  const handleNewTranscription = (newText) => {
    setTranscriptions((prev) => [...prev, newText]);
  };

  useEffect(() => {
    setVideoTracks(
      Array.from(participant.videoTracks.values())
        .map((pub) => pub.track)
        .filter((track) => track)
    );
    setAudioTracks(
      Array.from(participant.audioTracks.values())
        .map((pub) => pub.track)
        .filter((track) => track)
    );

    participant.on("trackSubscribed", trackSubscribed);
    participant.on("trackUnsubscribed", trackUnsubscribed);

    return () => {
      participant.removeAllListeners();
    };
  }, [participant]);

  useEffect(() => {
    const videoTrack = videoTracks[0];
    if (videoTrack) {
      videoTrack.attach(videoRef.current);
      return () => {
        videoTrack.detach();
      };
    }
  }, [videoTracks]);

  useEffect(() => {
    const audioTrack = audioTracks[0];
    if (audioTrack) {
      audioTrack.attach(audioRef.current);
      return () => {
        audioTrack.detach();
      };
    }
  }, [audioTracks]);

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

          socket.emit("transcribe_audio", {
            participant: participant.identity,
            language: selectedLanguage,
            audioData: arrayBuffer,
          });
        }
      });

      recorder.start();

      intervalId = setInterval(() => {
        if (recorder.state === "recording") {
          recorder.stop();
          recorder.start();
        }
      }, 5000);

      return () => {
        clearInterval(intervalId);
        if (recorder.state !== "inactive") {
          recorder.stop();
        }
      };
    }
  }, [audioTracks, participant, selectedLanguage]);

  useEffect(() => {
    socket.on(`transcription_${participant.identity}`, (data) => {
      handleNewTranscription(data.transcription);
    });

    return () => {
      socket.off(`transcription_${participant.identity}`);
    };
  }, [participant.identity]);

  return (
    <div className="participant" id={participant.identity}>
      <div className="identity">
        {participant.identity} {isLocal && "(me)"}
      </div>
      <div className="transcription-container">
        {transcriptions.map((text, index) => (
          <p key={index} className="transcription-text">
            {text}
          </p>
        ))}
      </div>
      <video ref={videoRef} autoPlay />
      <audio ref={audioRef} autoPlay />
    </div>
  );
};

export default Participant;
