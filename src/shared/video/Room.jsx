/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Participant from "./Participant";

const Room = ({ room, leaveRoom }) => {
  const [remoteParticipants, setRemoteParticipants] = useState(
    Array.from(room.participants.values())
  );

  useEffect(() => {
    room.on("participantConnected", (participant) => {
      setRemoteParticipants((prev) => [...prev, participant]);
    });
    room.on("participantDisconnected", (participant) => {
      setRemoteParticipants((prev) => prev.filter((p) => p !== participant));
    });
  }, [room]);

  return (
    <div className="app room">
      <h2>{room.name}</h2>
      <div className="participants">
        <Participant
          key={room.localParticipant.identity}
          participant={room.localParticipant}
        />
        {remoteParticipants.map((participant) => (
          <Participant key={participant.identity} participant={participant} />
        ))}
      </div>
      <button onClick={leaveRoom}>Leave Video Call</button>
    </div>
  );
};

export default Room;
