/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";

const Participant = ({ participant }) => {
  const [videoTracks, setVideoTracks] = useState([]);
  const [audioTracks, setAudioTracks] = useState([]);
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

  return (
    <div className="participant" id={participant.identity}>
      <div className="identity">{participant.identity}</div>
      <video ref={videoRef} autoPlay />
      <audio ref={audioRef} autoPlay muted />
    </div>
  );
};

export default Participant;
