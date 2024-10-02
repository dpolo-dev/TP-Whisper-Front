import { useEffect, useState } from "react";
import { connect } from "twilio-video";
import Room from "../../shared/video/Room";
import * as videoService from "../../services/twilioService";
import {
  listenForRoomCreation,
  removeListeners,
} from "../../services/socketService";

const Client = () => {
  const [identity, setIdentity] = useState("");
  const [room, setRoom] = useState();
  const [roomList, setRoomList] = useState([]);
  const [showControls, setShowControls] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [parentSid, setParentSid] = useState("");

  // Fetch room list when the component mounts
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

  const createRoom = async () => {
    try {
      await videoService.createRoom(newRoomName);
      setNewRoomName("");
    } catch (err) {
      console.error("Error creating room", err);
    }
  };

  const createBreakoutRoom = async () => {
    if (!roomList.find((mainRoom) => room?.sid === mainRoom._id)) {
      console.log("Creating nested breakout rooms is not yet implemented.");
      return;
    }

    try {
      await videoService.createBreakoutRoom(newRoomName, room?.sid);
      setNewRoomName("");
    } catch (err) {
      console.error("Error creating breakout room", err);
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
    <div className="app">
      <label className="start">
        <input
          type="checkbox"
          checked={showControls}
          onChange={() => setShowControls(!showControls)}
        />
        Show Room Controls
      </label>

      {showControls && (
        <div className="controls">
          <label className="start">
            Name your room:
            <input
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
            />
          </label>
          <button
            disabled={!newRoomName}
            onClick={room ? createBreakoutRoom : createRoom}
          >
            {room ? "Create Breakout Room" : "Create Room"}
          </button>
        </div>
      )}
      {room === undefined ? (
        <div className="start">
          <input
            value={identity}
            onChange={(e) => setIdentity(e.target.value)}
            placeholder="Enter your name"
          />
        </div>
      ) : (
        <Room
          room={room}
          joinRoom={joinRoom}
          leaveRoom={leaveRoom}
          breakoutRoomList={getBreakoutRooms()}
          parentSid={parentSid}
        />
      )}

      <div className="video-rooms-list">
        {room == null && roomList.length > 0 && (
          <h3>Video Rooms - Click a button to join</h3>
        )}
        {room == null &&
          roomList.map((room) => (
            <button
              key={room._id}
              disabled={!identity}
              onClick={() => joinRoom(room._id)}
            >
              {room.name}
            </button>
          ))}
      </div>
    </div>
  );
};

export default Client;
