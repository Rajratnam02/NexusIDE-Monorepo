import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import JoinRoom from "./pages/JoinRoom";
import Room from "./pages/Room";
import Settings from "./pages/Settings";
import { useAuthStore } from "./stores/authStore";

const App = () => {
  const listenToAuth = useAuthStore((state) => state.listenToAuth);
  useEffect(() => {
    listenToAuth();
  }, []);

  return (
    <div>
      <Routes>
        {/* done */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* done */}
        <Route path="/dashboard" element={<Dashboard />} />
        {/* done */}
        <Route path="/join" element={<JoinRoom />} />

        <Route path="/room/:roomId" element={<Room />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  );
};

export default App;
