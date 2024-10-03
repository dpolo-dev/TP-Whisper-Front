import { useState, useEffect, useCallback } from "react";

export function useParticipantTracks(participant) {
  const [videoTracks, setVideoTracks] = useState([]);
  const [audioTracks, setAudioTracks] = useState([]);

  const trackSubscribed = useCallback((track) => {
    if (track.kind === "video") {
      setVideoTracks((prevTracks) => [...prevTracks, track]);
    } else if (track.kind === "audio") {
      setAudioTracks((prevTracks) => [...prevTracks, track]);
    }
  }, []);

  const trackUnsubscribed = useCallback((track) => {
    if (track.kind === "video") {
      setVideoTracks((prevTracks) => prevTracks.filter((t) => t !== track));
    } else if (track.kind === "audio") {
      setAudioTracks((prevTracks) => prevTracks.filter((t) => t !== track));
    }
  }, []);

  useEffect(() => {
    setVideoTracks(
      Array.from(participant.videoTracks.values())
        .map((publication) => publication.track)
        .filter(Boolean)
    );
    setAudioTracks(
      Array.from(participant.audioTracks.values())
        .map((publication) => publication.track)
        .filter(Boolean)
    );

    participant.on("trackSubscribed", trackSubscribed);
    participant.on("trackUnsubscribed", trackUnsubscribed);

    return () => {
      participant.off("trackSubscribed", trackSubscribed);
      participant.off("trackUnsubscribed", trackUnsubscribed);
    };
  }, [participant, trackSubscribed, trackUnsubscribed]);

  return { videoTracks, audioTracks };
}
