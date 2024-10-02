import io from "socket.io-client";

let socket;

export const initializeSocket = (url) => {
  socket = io(url, { transports: ["websocket"] });

  socket.on("connect", () => {
    console.log("Connected to Socket.IO");
  });

  return socket;
};

export const subscribeToRoomEvents = (callback) => {
  if (!socket) return;

  socket.on("Main room created", callback);
  socket.on("Breakout room created", callback);
};

export const unsubscribeFromRoomEvents = () => {
  if (!socket) return;

  socket.off("Main room created");
  socket.off("Breakout room created");
};
