import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Interview from "./pages/Interview";
import Analytics from "./pages/Analytics";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from './components/ProtectedRoute';
import MyResumes from "./pages/MyResumes";
import GoogleCallback from './pages/GoogleCallback';


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Pages */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/my-resumes" element={<ProtectedRoute><MyResumes /></ProtectedRoute>} />
        <Route path="/oauth2/callback" element={<GoogleCallback />} />

        {/* Protected Pages */}
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/interview" element={
          <ProtectedRoute><Interview /></ProtectedRoute>
        } />
        <Route path="/analytics" element={
          <ProtectedRoute><Analytics /></ProtectedRoute>
        } />

      </Routes>
    </BrowserRouter>
  );
}

export default App;