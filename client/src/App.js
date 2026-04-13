import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProfileSetup from "./pages/Onboarding/ProfileSetup";
import KidsDashboard from "./pages/Kids/KidsDashboard";
import Health from "./pages/Health/Health";
import Medications from "./pages/Medications/Medications";
import Dialysis from "./pages/Dialysis/Dialysis";

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

        <Route path="/medications" element={<Medications />} />
      </Routes>
    </Router>
  );
}

export default App;
