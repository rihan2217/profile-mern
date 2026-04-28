import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreatePost() {
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

    if (!form.content && !form.image) {
      setError("Please fill all fields!");
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      await axios.post("/api/CreatePost", form, {
        withCredentials: true,  // ← important! sends cookies
      });
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gray-800 text-gray-300 flex flex-col items-center justify-center">
      <h1 className="p-4 bg-green-500 text-white text-3xl font-bold m-4">
        Create Posts
      </h1>
      <div className="p-2 m-4 border-2 bg-gray-950 text-light-gray min-w-[40vw] rounded">
        <form onSubmit={handlesubmit}>

          {error && (
            <p className="text-red-500 text-center p-2">{error}</p>
          )}

          <div className="p-2 flex gap-4">
            <label className="w-1/3">Write your post</label>
            <textarea
              className="p-2 w-2/3 text-black bg-white"
              type="text"
              placeholder="enter your content"
              name="content"
              onChange={handlechange}
            ></textarea>
          </div>

          <div className="p-2 flex gap-4">
            <label className="w-1/3">Image Post</label>
            <input
              className="p-2 w-2/3 text-black bg-white"
              type="text"
              placeholder="enter your image"
              name="image"
              onChange={handlechange}
            />
          </div>

          <div className="m-2 flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="mt-4 p-2 rounded bg-green-600 text-white disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create data"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/read")}
              className="mt-4 p-2 rounded bg-green-600 text-white"
            >
              Read Post
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default CreatePost;