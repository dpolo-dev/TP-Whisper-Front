import { connect } from "twilio-video";

// Obtener token para la sala
export const fetchTwilioToken = async (identity, roomSid) => {
  try {
    const response = await fetch("http://localhost:5000/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identity,
        roomSid,
      }),
    });

    const data = await response.json();
    return data.accessToken;
  } catch (error) {
    console.error("Error fetching token:", error);
    throw error;
  }
};

// Conectar a la sala de Twilio
export const joinTwilioRoom = async (token, roomSid) => {
  try {
    const room = await connect(token, {
      audio: true,
      video: { width: 640, height: 480 },
      name: roomSid,
    });
    return room;
  } catch (error) {
    console.error("Error connecting to room:", error);
    throw error;
  }
};

// Desconectar de la sala
export const leaveTwilioRoom = (room) => {
  if (room) {
    room.localParticipant.tracks.forEach((publication) => {
      if (
        publication.track.kind === "audio" ||
        publication.track.kind === "video"
      ) {
        publication.track.stop();
        const attachedElements = publication.track.detach();
        attachedElements.forEach((element) => element.remove());
      }
    });
    room.disconnect();
  }
};
