import { connect, createLocalVideoTrack } from "twilio-video";
import { API_BASE } from "../../general-config";

export const getTwilioToken = async (identity) => {
  const response = await fetch(`${API_BASE}/api/get-twilio-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ identity }),
  });
  const { token } = await response.json();
  return token;
};

export const connectToRoom = async (token, roomName = "new-room") => {
  try {
    const room = await connect(token, {
      video: true,
      audio: true,
      name: roomName,
    });
    return room;
  } catch (error) {
    console.error("Error connecting to Twilio room:", error);
    throw new Error("Failed to connect to the room");
  }
};

export const attachLocalVideo = async (videoRef) => {
  if (videoRef.current.children.length < 1) {
    const localTrack = await createLocalVideoTrack();
    videoRef.current.appendChild(localTrack.attach());
  }
};
