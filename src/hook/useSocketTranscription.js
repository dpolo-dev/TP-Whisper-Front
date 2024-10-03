import { useEffect } from "react";
import socket from "../services/socketService";

export function useSocketTranscription(
  participantIdentity,
  handleNewTranscription
) {
  useEffect(() => {
    const eventName = `transcription_${participantIdentity}`;

    socket.on(eventName, (data) => {
      handleNewTranscription(data.transcription);
    });

    return () => {
      socket.off(eventName);
    };
  }, [participantIdentity, handleNewTranscription]);
}
