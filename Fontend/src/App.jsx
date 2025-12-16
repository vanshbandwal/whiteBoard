// src/App.jsx
import { Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";

import Home from "./pages/Home";
import ProtectedRoute from "./ProtectedRoute";
import DashBoard from "./pages/DashBoard";
import Login from "./pages/Login";

function App() {
  return (
    <>
      <Routes>
        {/* Protected Route */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/room/:roomId"
          element={
            <ProtectedRoute>
              <DashBoard />
            </ProtectedRoute>
          }
        />

        {/* Public Routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
