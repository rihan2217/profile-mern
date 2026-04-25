import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handlechange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const handlesubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please fill all fields!");
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      await axios.post("/api/login", form, {
        withCredentials: true,  // ← important! sends cookies
      });
      navigate("/read");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gray-800 text-gray-300 flex flex-col items-center justify-center">
      <h1 className="p-4 bg-green-500 text-white text-3xl font-bold m-4">
        Login
      </h1>
      <div className="p-2 m-4 border-2 bg-gray-950 text-light-gray min-w-[40vw] rounded">
        <form onSubmit={handlesubmit}>

          {error && (
            <p className="text-red-500 text-center p-2">{error}</p>
          )}

          <div className="p-2 flex gap-4">
            <label className="w-1/3">Email</label>
            <input
              className="p-2 w-2/3 text-black bg-white"
              type="email"
              placeholder="enter your email"
              name="email"
              onChange={handlechange}
            />
          </div>

          <div className="p-2 flex gap-4">
            <label className="w-1/3">Password</label>
            <input
              className="p-2 w-2/3 text-black bg-white"
              type="password"
              placeholder="enter your password"
              name="password"
              onChange={handlechange}
            />
          </div>

          <div className="m-2 flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="mt-4 p-2 rounded bg-green-600 text-white disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-4 p-2 rounded bg-gray-600 text-white"
            >
              Register instead
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default Login;