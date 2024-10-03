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
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import { brand, gray } from "./shared/themePrimitives";
import "./style/global.css";
import { LanguageProvider } from "./context/LanguageContext";
import LanguageSelector from "./shared/customizations/LanguageSelector";
import { ModelProvider } from "./context/ModelContext";

const AppContainer = styled(Stack)(({ theme }) => ({
  minHeight: "100vh",
  padding: theme.spacing(2),
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage: `radial-gradient(at 50% 50%, ${brand[800]}, ${gray[800]})`,
    }),
  },
}));

export default function App() {
  return (
    <AppTheme>
      <AppContainer>
        <Provider store={store}>
          <LanguageProvider>
            <ModelProvider>
              <CssBaseline />
              <LanguageSelector />

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
            </ModelProvider>
          </LanguageProvider>
        </Provider>
      </AppContainer>
    </AppTheme>
  );
}
