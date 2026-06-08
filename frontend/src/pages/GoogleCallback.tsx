import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function GoogleCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      // ✅ Save token first
      localStorage.setItem("token", token);
      
      // ✅ Small delay to ensure localStorage is written before navigation
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 100);
    } else {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#070B1A] flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-400">Signing you in with Google...</p>
      </div>
    </div>
  );
}