import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Post() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/post", { withCredentials: true })
      .then((res) => setPosts(res.data))
      .catch(() => navigate("/login"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-white text-center mt-10">Loading...</p>;
  if (posts.length === 0) return <p className="text-white text-center mt-10">No posts yet.</p>;

  return (
    <div className="bg-gray-800 min-h-screen p-6">
      <h1 className="text-3xl font-bold text-white text-center mb-8">All Posts</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-gray-700 rounded-xl shadow-lg overflow-hidden hover:bg-gray-600 transition"
          >
            {/* author */}
            <div className="flex items-center gap-3 p-4">
              <img
                src={post.user?.image || "/default-avatar.png"}
                alt={post.user?.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="text-white font-medium">
                {post.user?.username || "Unknown"}
              </span>
            </div>

            {/* image only OR image + content */}
            {post.image && (
              <img
                src={post.image}
                alt="post"
                className="w-full object-cover max-h-72"
              />
            )}

            {/* content only OR image + content */}
            {post.content && (
              <p className="text-gray-300 p-4">{post.content}</p>
            )}

            {/* footer - date + likes */}
            <div className="flex items-center justify-between px-4 pb-4 text-gray-400 text-sm">
              <span>❤️ {post.likes?.length || 0} likes</span>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Post;