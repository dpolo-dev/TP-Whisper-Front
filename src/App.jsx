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
import { Provider } from "react-redux";
import { store } from "./store/store";
import PrivateRoute from "./guards/PrivateRoute";

export default function App() {
  return (
    <AppTheme>
      <Provider store={store}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/client"
              element={
                <PrivateRoute allowedUserType="client">
                  <Client />
                </PrivateRoute>
              }
            />
            <Route
              path="/customer"
              element={
                <PrivateRoute allowedUserType="customer">
                  <Customer />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </Provider>
    </AppTheme>
  );
}
