import { useEffect, useMemo, useState } from "react";
import { connect } from "twilio-video";
import Room from "../../shared/video/Room";
import * as videoService from "../../services/twilioService";
import {
  listenForRoomCreation,
  removeListeners,
} from "../../services/socketService";
import { useSelector } from "react-redux";
import RefreshIcon from "@mui/icons-material/Refresh";
import LogoutButton from "../../shared/customizations/LogoutButton";
import ModelSelect from "../../shared/customizations/ModelSelect";

const generateRoomName = (roomName) => {
  const parts = roomName.split("_");

  if (parts.length >= 3) {
    const [, username, id] = parts;

    const formattedUsername = username
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    const capitalizedUsername = formattedUsername
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

    return `Room for ${capitalizedUsername} (${id.slice(0, 6)}...)`;
  }

  return roomName.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, " ");
};

const Customer = () => {
  const user = useSelector((state) => state.user.user);

  const identity = useMemo(() => user.username, [user.username]);

  const [room, setRoom] = useState();
  const [roomList, setRoomList] = useState([]);
  const [parentSid, setParentSid] = useState("");

  useEffect(() => {
    fetchRooms();

    listenForRoomCreation(fetchRooms, fetchRooms);

    return () => {
      removeListeners();
    };
  }, []);

  const fetchRooms = async () => {
    try {
      const rooms = await videoService.listRooms();
      setRoomList(rooms);
    } catch (err) {
      console.error("Error fetching rooms", err);
    }
  };

  const joinRoom = async (roomSid, breakout = false) => {
    try {
      if (room) {
        await room.disconnect();
      }

      const accessToken = await videoService.joinRoom(identity, roomSid);

      const videoRoom = await connect(accessToken, {
        audio: true,
        video: { width: 640, height: 480 },
      });

      setRoom(videoRoom);
      if (!breakout) setParentSid(videoRoom.sid);
    } catch (err) {
      console.error("Error joining room", err);
    }
  };

  const leaveRoom = async () => {
    if (room) {
      room.localParticipant.tracks.forEach((publication) => {
        if (["audio", "video"].includes(publication.track.kind)) {
          publication.track.stop();
          publication.track.detach().forEach((element) => element.remove());
        }
      });

      room.disconnect();
      setRoom(undefined);
    }
  };

  const getBreakoutRooms = () => {
    if (room) {
      const roomInfo = roomList.find((mainRoom) => mainRoom._id === room.sid);
      return roomInfo ? roomInfo.breakouts : [];
    }
    return [];
  };

  return (
    <>
      <LogoutButton />
      <ModelSelect />

      {!!room && (
        <Room
          room={room}
          joinRoom={joinRoom}
          leaveRoom={leaveRoom}
          breakoutRoomList={getBreakoutRooms()}
          parentSid={parentSid}
        />
      )}

      {!room && (
        <div className="video-rooms-list">
          {roomList.length > 0 ? (
            <h3>Video Rooms - Click a button to join</h3>
          ) : (
            <>
              <h3>No clients are connected at the moment.</h3>
              <p>Please log out or wait for new clients to join.</p>
              <div className="refresh-button">
                <RefreshIcon
                  onClick={() => window.location.reload()}
                  style={{ fontSize: 40, cursor: "pointer", color: "#ff4757" }}
                />
              </div>
            </>
          )}

          {roomList.map((room) => (
            <button
              key={room._id}
              disabled={!identity}
              className="video-room-button"
              onClick={() => joinRoom(room._id)}
            >
              {generateRoomName(room.name)}
            </button>
          ))}
        </div>
      )}
    </>
  );
};

export default Customer;
