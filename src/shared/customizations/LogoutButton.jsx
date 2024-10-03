import { useDispatch } from "react-redux";
import IconButton from "@mui/material/IconButton";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { Box } from "@mui/material";
import { logout } from "../../store/userSlice";

const LogoutButton = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 10,
        right: 10,
      }}
    >
      <IconButton onClick={handleLogout} color="primary">
        <ExitToAppIcon />
      </IconButton>
    </Box>
  );
};

export default LogoutButton;
