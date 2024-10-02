import { useSelector } from "react-redux";
import VideoComponent from "../../shared/video/VideoComponent";
import { useMemo } from "react";

const Client = () => {
  const user = useSelector((state) => state.user.user);

  const roomName = useMemo(
    () => `room_${user.username}_${user.id}`,
    [user.username, user.id]
  );

  return <VideoComponent roomName={roomName} user={user} />;
};

export default Client;
