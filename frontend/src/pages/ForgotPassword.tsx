import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleForgotPassword = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/forgot-password?email=${email}`,
        {
          method: "POST",
        }
      );

      const data = await response.text();
      setMessage(data);
    } catch (error) {
      setMessage("Server Error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-white p-8 rounded-xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Forgot Password
        </h1>

        <input
          type="email"
          placeholder="Enter Email"
          className="w-full border p-3 mb-4 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleForgotPassword}
          className="w-full bg-violet-600 text-white py-3 rounded"
        >
          Generate Reset Token
        </button>

       {message && (
  <>
    <p className="mt-4 break-all">
      Token: {message}
    </p>

    <a
      href="/reset-password"
      className="text-violet-600 block mt-4"
    >
      Go To Reset Password
    </a>
  </>
)}
      </div>
    </div>
  );
}