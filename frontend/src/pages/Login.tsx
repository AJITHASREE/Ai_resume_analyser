import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Login() {

  const navigate = useNavigate();

  // State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Error State
  const [error, setError] = useState("");

  // Login Function
const handleLogin = async () => {

  try {

    const response = await fetch(
      "http://localhost:8080/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const token = await response.text();

    if (
      token === "User not found" ||
      token === "Invalid password"
    ) {

      setError(token);
      return;

    }

    localStorage.setItem("token", token);

    navigate("/dashboard");

  } catch (error) {

    setError("Server error");

  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#111827] to-[#1E1B4B] flex items-center justify-center p-6">

      {/* Login Card */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">

        {/* Heading */}
        <div className="text-center">

          <h1 className="text-4xl font-bold text-white">
            Welcome Back
          </h1>

          <p className="text-gray-300 mt-3">
            Login to continue your AI career journey
          </p>

        </div>

        {/* Form */}
        <div className="mt-10 space-y-5">

          {/* Email */}
          <div>

            <label className="text-sm text-gray-300">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-2 bg-white/10 border border-white/10 text-white placeholder-gray-400 p-4 rounded-2xl outline-none focus:border-violet-400"
            />

          </div>

          {/* Password */}
          <div>

            <label className="text-sm text-gray-300">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-2 bg-white/10 border border-white/10 text-white placeholder-gray-400 p-4 rounded-2xl outline-none focus:border-violet-400"
            />

          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between text-sm">

            <label className="flex items-center gap-2 text-gray-300">
              <input type="checkbox" />
              Remember me
            </label>

          <Link to="/forgot-password" className="text-violet-500">Forgot Password?</Link>

          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-400 text-sm">
              {error}
            </p>
          )}

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 transition-all py-4 rounded-2xl text-white font-semibold text-lg"
          >
            Sign In
          </button>
          {/* Divider */}
<div className="flex items-center gap-3 my-2">
  <div className="flex-1 h-px bg-white/10" />
  <span className="text-gray-500 text-sm">or</span>
  <div className="flex-1 h-px bg-white/10" />
</div>

{/* Google Sign In */}
<button
  onClick={() => window.location.href = "http://localhost:8080/oauth2/authorization/google"}
  className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 hover:bg-gray-100 transition-all py-4 rounded-2xl font-semibold text-base"
>
  <img
    src="https://www.google.com/favicon.ico"
    alt="Google"
    className="w-5 h-5"
  />
  Continue with Google
</button>

          {/* Demo Credentials */}
          <div className="bg-white/5 rounded-2xl p-4 text-sm text-gray-300">

           <p className="text-center text-gray-300 mt-4">
  New user?

  <button
    onClick={() => navigate("/register")}
    className="text-violet-400 ml-2"
  >
    Create Account
  </button>
</p>
          </div>

        </div>
      </div>
    </div>
    
  );
}