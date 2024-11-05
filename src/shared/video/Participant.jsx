/* eslint-disable react/prop-types */
import { useContext,  useRef, useState, useCallback } from "react";
import { LanguageContext } from "../../context/LanguageContext";
import { ModelContext } from "../../context/ModelContext";
import { useParticipantTracks } from "../../hook/useParticipantTracks";
import { useTrackAttachment } from "../../hook/useTrackAttachment";
import { useTranscription } from "../../hook/useTranscription";
import { useSocketTranscription } from "../../hook/useSocketTranscription";

const Participant = ({ isLocal, participant }) => {
  const { selectedLanguage, targetLanguage } = useContext(LanguageContext);
  const { selectedModel } = useContext(ModelContext);

  const [transcriptions, setTranscriptions] = useState([]);
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  const { videoTracks, audioTracks } = useParticipantTracks(participant);

  useTrackAttachment(videoTracks, videoRef);
  useTrackAttachment(audioTracks, audioRef);

  const handleNewTranscription = useCallback(
    (newText) => {
      setTranscriptions((prev) => {
        if (prev.length === 0 || prev[0].trim() !== newText.trim()) {
          return [newText.trim(), ...prev];
        }
        return prev;
      });
    },
    [setTranscriptions]
  );

  useTranscription(
    audioTracks,
    participant,
    selectedLanguage,
    targetLanguage,
    selectedModel,
    handleNewTranscription
  );

  useSocketTranscription(participant.identity, handleNewTranscription);

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
