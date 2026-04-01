import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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

        {/* 4. Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
