import { useEffect, useMemo, useState, useCallback } from "react";
import { connect } from "twilio-video";
import Room from "../../shared/video/Room";
import * as videoService from "../../services/twilioService";
import { useSelector } from "react-redux";
import { CircularProgress } from "@mui/material";
import {
  listenForRoomCreation,
  removeListeners,
} from "../../services/socketService";

const Client = () => {
  const user = useSelector((state) => state.user.user);

  const [room, setRoom] = useState(null);
  const [roomList, setRoomList] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [roomJoined, setRoomJoined] = useState(false);

  const identity = useMemo(() => user.username, [user.username]);
  const newRoomName = useMemo(
    () => `room_${user.username}_${user.id}`,
    [user.username, user.id]
  );

  useEffect(() => {
    console.log(roomList);
  }, [roomList]);

  const fetchRooms = useCallback(async () => {
    try {
      const rooms = await videoService.listRooms();
      setRoomList(rooms);
    } catch (err) {
      console.error("Error fetching rooms", err);
    } finally {
      setIsFetching(false);
    }
  }, []);

  const createRoom = useCallback(async () => {
    try {
      const existingRoom = roomList.find((r) => r.name === newRoomName);
      if (!existingRoom) {
        await videoService.createRoom(newRoomName);
        await fetchRooms();
      }
    } catch (err) {
      console.error("Error creating room", err);
    }
  }, [newRoomName, roomList, fetchRooms]);

  const joinRoom = useCallback(
    async (roomSid) => {
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
        setRoomJoined(true);
      } catch (err) {
        console.error("Error joining room", err);
      }
    },
    [identity, room]
  );

  const leaveRoom = useCallback(() => {
    if (room) {
      room.localParticipant.tracks.forEach((publication) => {
        if (["audio", "video"].includes(publication.track.kind)) {
          publication.track.stop();
          publication.track.detach().forEach((element) => element.remove());
        }
      });

      room.disconnect();
      setRoom(null);
      setRoomJoined(false);
    }
  }, [room]);

  const handleRoomCreationAndJoining = useCallback(async () => {
    if (roomJoined) return;

    const existingRoom = roomList.find((r) => r.name === newRoomName);
    if (existingRoom) {
      await joinRoom(existingRoom.sid);
    } else if (roomList.length === 0) {
      await createRoom();
      const updatedRoom = roomList.find((r) => r.name === newRoomName);
      if (updatedRoom) {
        await joinRoom(updatedRoom.sid);
      }
    }
  }, [newRoomName, roomList, roomJoined, createRoom, joinRoom]);

  useEffect(() => {
    fetchRooms();

    listenForRoomCreation(fetchRooms, fetchRooms);

    return () => {
      removeListeners();
    };
  }, [fetchRooms]);

  useEffect(() => {
    if (!isFetching) {
      handleRoomCreationAndJoining();
    }
  }, [roomList, isFetching, handleRoomCreationAndJoining]);

  return !room ? (
    <CircularProgress />
  ) : (
    <Room room={room} leaveRoom={leaveRoom} />
  );
};

export default Client;
