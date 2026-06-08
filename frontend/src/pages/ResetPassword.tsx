import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function ResetPassword() {

  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [searchParams] = useSearchParams();

  useEffect(() => {

  const tokenFromUrl =
    searchParams.get("token");

  if (tokenFromUrl) {
    setToken(tokenFromUrl);
  }

}, [searchParams]);

  const handleResetPassword = async () => {

    try {

      const response = await fetch(
        `http://localhost:8080/api/auth/reset-password?token=${token}&newPassword=${newPassword}`,
        {
          method: "POST"
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
          Reset Password
        </h1>

        <input
          type="password"
          placeholder="New Password"
          className="w-full border p-3 mb-4 rounded"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button
          onClick={handleResetPassword}
          className="w-full bg-violet-600 text-white py-3 rounded"
        >
          Reset Password
        </button>

        {message && (
          <p className="mt-4 text-center">
            {message}
          </p>
        )}

      </div>

    </div>
  );
}