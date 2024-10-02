import { useSelector } from "react-redux";
import VideoComponent from "../../shared/video/VideoComponent";

const Client = () => {
  const user = useSelector((state) => state.user.user);

  const roomName = `room_${user.username}_${user.id}`;

  return (
    <div>
      <h1>Client Dashboard</h1>
      <VideoComponent roomName={roomName} user={user} />
    </div>
  );
};

export default Client;
