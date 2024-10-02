import { useSelector } from "react-redux";
import VideoComponent from "../../shared/video/VideoComponent";

const Client = () => {
  const user = useSelector((state) => state.user.user);

  const roomName = `room_${user.username}_${user.id}`;

  return <VideoComponent roomName={roomName} user={user} />;
};

export default Client;
