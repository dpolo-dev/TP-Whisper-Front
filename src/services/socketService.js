import io from "socket.io-client";
import { apiUrl } from "../../general-config";

const socket = io(apiUrl, {
  transports: ["websocket"],
});

export const listenForRoomCreation = (
  onMainRoomCreated,
  onBreakoutRoomCreated
) => {
  socket.on("Main room created", onMainRoomCreated);
  socket.on("Breakout room created", onBreakoutRoomCreated);
};

export const removeListeners = () => {
  socket.off("Main room created");
  socket.off("Breakout room created");
};

export default socket;
