/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import socket from "../../services/socketService";

const Participant = ({ isLocal, participant }) => {
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

    setTimeout(() => {
      setTranscriptions((prev) => prev.slice(1));
    }, 5000);
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
      const mediaStream = new MediaStream([audioTrack.mediaStreamTrack]);

      const mediaRecorder = new MediaRecorder(mediaStream);

      mediaRecorder.ondataavailable = (event) => {
        const audioBlob = event.data;
        const reader = new FileReader();

        reader.onloadend = () => {
          const audioData = reader.result;

          socket.emit("transcribe_audio", {
            participant: participant.identity,
            audioData,
          });
        };

        reader.readAsArrayBuffer(audioBlob);
      };

      mediaRecorder.start(500);

      return () => {
        mediaRecorder.stop();
      };
    }
  }, [audioTracks, participant]);

  useEffect(() => {
    socket.on(`transcription_${participant.identity}`, (data) => {
      handleNewTranscription(data.transcription);
    });

    return () => {
      socket.off(`transcription_${participant.identity}`);
    };
  }, [participant.identity]);

  useEffect(() => {
    if (transcriptions.length > 0) {
      const lastTranscription = transcriptions[transcriptions.length - 1];
      const timer = setTimeout(() => {
        document.getElementById(lastTranscription.id).classList.add("fade-out");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [transcriptions]);

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
