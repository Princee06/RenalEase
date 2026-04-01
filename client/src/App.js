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
        {/* Default route — Intro/Splash screen */}
        <Route path="/" element={<Intro />} />
        <Route path="/walkthrough" element={<Walkthrough />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
