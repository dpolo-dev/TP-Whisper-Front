import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../store/userSlice";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const [usernameError, setUsernameError] = useState(false);
  const [usernameErrorMessage, setUsernameErrorMessage] = useState("");
  const [userTypeError, setUserTypeError] = useState(false);
  const [userTypeErrorMessage, setUserTypeErrorMessage] = useState("");
  const [selectedUserType, setSelectedUserType] = useState("");

  useEffect(() => {
    if (user) {
      if (user.userType === "client") {
        navigate("/client");
      } else if (user.userType === "customer") {
        navigate("/customer");
      }
    }
  }, [user, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateInputs()) {
      return;
    }
    const data = new FormData(event.currentTarget);

    const userData = {
      id: uuidv4(),
      username: data.get("username"),
      userType: selectedUserType,
    };

    dispatch(login(userData));

    if (selectedUserType === "client") {
      navigate("/client");
    } else if (selectedUserType === "customer") {
      navigate("/customer");
    }
  };

  const validateInputs = () => {
    const username = document.getElementById("username").value;
    let isValid = true;

    if (!username || username.length < 3) {
      setUsernameError(true);
      setUsernameErrorMessage("Username must be at least 3 characters long.");
      isValid = false;
    } else {
      setUsernameError(false);
      setUsernameErrorMessage("");
    }

    if (!selectedUserType) {
      setUserTypeError(true);
      setUserTypeErrorMessage("Please select a user type.");
      isValid = false;
    } else {
      setUserTypeError(false);
      setUserTypeErrorMessage("");
    }

    return isValid;
  };

  const handleUserTypeChange = (userType) => {
    setSelectedUserType(userType);
  };

  return (
    <Card variant="outlined">
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          gap: 2,
        }}
      >
        <FormControl>
          <FormLabel htmlFor="username">User Name</FormLabel>
          <TextField
            error={usernameError}
            helperText={usernameErrorMessage}
            id="username"
            name="username"
            placeholder="Enter your username"
            autoComplete="username"
            autoFocus
            required
            fullWidth
            variant="outlined"
            color={usernameError ? "error" : "primary"}
            sx={{ ariaLabel: "username" }}
          />
        </FormControl>

        <FormControl>
          <FormLabel>User Type</FormLabel>
          <Stack direction="row" spacing={2}>
            <Chip
              label="Client"
              clickable
              variant={selectedUserType === "client" ? "filled" : "outlined"}
              color={selectedUserType === "client" ? "primary" : "default"}
              onClick={() => handleUserTypeChange("client")}
            />
            <Chip
              label="Customer"
              clickable
              variant={selectedUserType === "customer" ? "filled" : "outlined"}
              color={selectedUserType === "customer" ? "primary" : "default"}
              onClick={() => handleUserTypeChange("customer")}
            />
          </Stack>
          {userTypeError && (
            <Box sx={{ color: "red", fontSize: "0.75rem" }}>
              {userTypeErrorMessage}
            </Box>
          )}
        </FormControl>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          onClick={validateInputs}
        >
          Sign in
        </Button>
      </Box>
    </Card>
  );
}
