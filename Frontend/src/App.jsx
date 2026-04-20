import React, { useEffect } from "react";
import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import JoinRoom from "./pages/JoinRoom";
import Room from "./pages/Room";
import Settings from "./pages/Settings";
import { useAuthStore } from "./stores/authStore";

/**
 * ProtectedRoute: The "Bouncer"
 * Prevents access to internal pages if the user is not logged in.
 * Handles the loading state to prevent crashes during Firebase initialization.
 */
const ProtectedRoute = () => {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-black text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <h1 className="text-xl font-bold tracking-widest text-blue-500">NEXUS</h1>
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

const App = () => {
  const listenToAuth = useAuthStore((state) => state.listenToAuth);

  useEffect(() => {
    const unsubscribe = listenToAuth();
        return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [listenToAuth]);

  return (
    <div className="bg-black min-h-screen selection:bg-blue-500/30">
      <Routes>
        {/* Public Routes - Accessible to everyone */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes - Only accessible if user is logged in */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/join" element={<JoinRoom />} />
          <Route path="/room/:roomId" element={<Room />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Catch-all - Redirects unknown paths to landing or dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;