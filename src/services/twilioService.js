import { apiUrl } from "../../general-config";

export const listRooms = async () => {
  try {
    const response = await fetch(`${apiUrl}/rooms/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    return data.rooms;
  } catch (err) {
    console.error("Error fetching rooms:", err);
    throw err;
  }
};

export const createRoom = async (roomName) => {
  try {
    const response = await fetch(`${apiUrl}/rooms/main`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomName }),
    });
    return await response.json();
  } catch (err) {
    console.error("Error creating room:", err);
    throw err;
  }
};

export const createBreakoutRoom = async (roomName, parentSid) => {
  try {
    const response = await fetch(`${apiUrl}/rooms/breakout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomName, parentSid }),
    });
    return await response.json();
  } catch (err) {
    console.error("Error creating breakout room:", err);
    throw err;
  }
};

export const joinRoom = async (identity, roomSid) => {
  try {
    const response = await fetch(`${apiUrl}/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identity, roomSid }),
    });

    const { accessToken } = await response.json();
    return accessToken;
  } catch (err) {
    console.error("Error joining room:", err);
    throw err;
  }
};
