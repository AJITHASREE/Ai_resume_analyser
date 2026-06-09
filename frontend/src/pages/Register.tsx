import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");

  const handleRegister = async () => {

    try {

     const response = await fetch(
  `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name,
            email,
            password
          })
        }
      );

      const data = await response.text();

      setMessage(data);

      if (data === "User registered successfully") {

        setTimeout(() => {
          navigate("/");
        }, 1500);

      }

    } catch (error) {

      setMessage("Backend connection failed");

    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">

      <div className="bg-white p-8 rounded-xl w-full max-w-md">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Register
        </h1>

        <input
          type="text"
          placeholder="Name"
          className="w-full border p-3 mb-4 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 mb-4 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 mb-4 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          className="w-full bg-violet-600 text-white py-3 rounded"
        >
          Register
        </button>

        {message && (
          <p className="mt-4 text-center">
            {message}
          </p>
        )}

        <p className="mt-4 text-center">
          Already have an account?
          <Link
            to="/login"
            className="text-violet-600 ml-2"
          >
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}