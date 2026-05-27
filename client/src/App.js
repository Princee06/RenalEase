import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProfileSetup from "./pages/Onboarding/ProfileSetup";
import KidsDashboard from "./pages/Kids/KidsDashboard";
import Health from "./pages/Health/Health";
import Medications from "./pages/Medications/Medications";
import Dialysis from "./pages/Dialysis/Dialysis";
import Profile from "./pages/Dashboard/Profile";
import Appointments from "./pages/Appointments/Appointments";
import Diet from "./pages/Diet/Diet";

// Auth
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";

// Onboarding
import Intro from "./pages/Onboarding/Intro";
import Walkthrough from "./pages/Onboarding/Walkthrough";

// Dashboard
import Dashboard from "./pages/Dashboard/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* 1. Intro/Splash */}
        <Route path="/" element={<Intro />} />

        {/* 2. Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* 3. Walkthrough — shown after signup only */}
        <Route path="/walkthrough" element={<Walkthrough />} />
        <Route path="/kids-dashboard" element={<KidsDashboard />} />

        {/* 4. Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
        <Route path="/health" element={<Health />} />
        <Route path="/dialysis" element={<Dialysis />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/medications" element={<Medications />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/diet" element={<Diet />} />
      </Routes>
    </Router>
  );
}

export default App;
