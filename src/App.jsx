import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import Login from "./login";
import Customer from "./customer";
import Client from "./client";
import AppTheme from "./shared/AppTheme";

export default function App() {
  return (
    <AppTheme>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/client" element={<Client />} />
          <Route path="/customer" element={<Customer />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AppTheme>
  );
}
