import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import {
  attachLocalVideo,
  connectToRoom,
  getTwilioToken,
} from "../../services/twilioService";

const VideoComponent = ({ roomName, user }) => {
  const [room, setRoom] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const startVideoCall = async () => {
      try {
        const token = await getTwilioToken(user.username);

        const room = await connectToRoom(token, roomName || `room|${user.username}|${user.id}`);
        setRoom(room);

        await attachLocalVideo(videoRef);

        room.on("participantConnected", (participant) => {
          console.log(`Participant ${participant.identity} connected`);
        });

        room.on("participantDisconnected", (participant) => {
          console.log(`Participant ${participant.identity} disconnected`);
        });
      } catch (error) {
        console.error("Error starting video call:", error);
      }
    };

    startVideoCall();

    return () => {
      if (room) {
        room.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomName, user]);

  return (
    <div>
      <h2>Video Call</h2>
      <div ref={videoRef} id="local-video"></div>
    </div>
  );
};

export default VideoComponent;

VideoComponent.propTypes = {
  roomName: PropTypes.string, 
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    userType: PropTypes.string.isRequired,
  }).isRequired,
};
