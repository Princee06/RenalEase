import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProfileSetup from "./pages/Onboarding/ProfileSetup";
import Health from "./pages/Health/Health";
import Medications from "./pages/Medications/Medications";
import Dialysis from "./pages/Dialysis/Dialysis";
import Profile from "./pages/Dashboard/Profile";
import Appointments from "./pages/Appointments/Appointments";
import Diet from "./pages/Diet/Diet";
import Hospitals from "./pages/Hospitals/Hospitals";
import Education from "./pages/Education/Education";
import KidsMode from "./pages/Kids/KidsMode";
import Chatbot from "./pages/Chatbot/Chatbot";
import FloatingChatBubble from "./pages/Chatbot/FloatingChatBubble";
import Analytics from "./pages/Analytics/Analytics";

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
        <Route path="/" element={<Intro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/walkthrough" element={<Walkthrough />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/health" element={<Health />} />
        <Route path="/medications" element={<Medications />} />
        <Route path="/dialysis" element={<Dialysis />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/diet" element={<Diet />} />
        <Route path="/doctors" element={<Hospitals />} />
        <Route path="/education" element={<Education />} />
        <Route path="/kids-dashboard" element={<KidsMode />} />
        <Route path="/kids" element={<KidsMode />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>

      <FloatingChatBubble />
    </Router>
  );
}

export default App;
