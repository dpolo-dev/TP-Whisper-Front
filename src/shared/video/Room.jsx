/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Participant from "./Participant";

const generateRoomName = (roomName) => {
  const formattedRoomName = roomName
    .split("_")[1]
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .replace(/\s+/g, " ");
  return `Room for ${formattedRoomName}`;
};

const Room = ({ room, leaveRoom }) => {
  const [remoteParticipants, setRemoteParticipants] = useState(
    Array.from(room.participants.values())
  );

  const updateParticipants = (participant) => {
    setRemoteParticipants((prev) => {
      const exists = prev.find((p) => p.identity === participant.identity);
      if (!exists) {
        return [...prev, participant];
      }
      return prev;
    });
  };

  const removeParticipant = (participant) => {
    setRemoteParticipants((prev) =>
      prev.filter((p) => p.identity !== participant.identity)
    );
  };

  useEffect(() => {
    room.on("participantConnected", (participant) => {
      updateParticipants(participant);
    });

    room.on("participantDisconnected", (participant) => {
      removeParticipant(participant);
    });

    return () => {
      room.off("participantConnected", updateParticipants);
      room.off("participantDisconnected", removeParticipant);
    };
  }, [room]);

  return (
    <div className="app room">
      <h2>{generateRoomName(room.name)}</h2>
      <div className="participants">
        <Participant
          isLocal={true}
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
