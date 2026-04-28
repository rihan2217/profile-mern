import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null); // ✅ add this
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ fetch all posts
    axios.get("/api/posts", { withCredentials: true })
      .then((res) => setPosts(res.data))
      .finally(() => setLoading(false));

    // ✅ fetch logged in user
    axios.get("/api/profile", { withCredentials: true })
      .then((res) => setCurrentUser(res.data))
      .catch(() => navigate('/login'));
  }, []);

  const handleLike = async (postId) => {
    try {
      await axios.post(`/api/post/like/${postId}`, {}, { withCredentials: true });
      setPosts((prev) =>
        prev.map((post) => {
          if (post._id !== postId) return post;
          const alreadyLiked = post.likes.includes(currentUser._id);
          return {
            ...post,
            likes: alreadyLiked
              ? post.likes.filter((id) => id !== currentUser._id)
              : [...post.likes, currentUser._id],
          };
        })
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="text-white text-center mt-10">Loading...</p>;
  if (posts.length === 0) return <p className="text-white text-center mt-10">No posts yet.</p>;

  return (
    <div className="bg-gray-800 min-h-screen p-6">
      <h1 className="text-3xl font-bold text-white text-center mb-8">All Posts</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {posts.map((post) => (
          <div key={post._id} className="bg-gray-700 rounded-xl shadow-lg overflow-hidden hover:bg-gray-600 transition">
            
            {/* author */}
            <div
              className="flex items-center gap-3 p-4 cursor-pointer"
              onClick={() => navigate(`/profile/${post.user?._id}`)}
            >
              <img
                src={post.user?.image || '/default-avatar.png'}
                alt={post.user?.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="text-white font-medium">
                {post.user?.username || 'Unknown'}
              </span>
            </div>

            {post.image && (
              <img src={post.image} alt="post" className="w-full object-cover max-h-72" />
            )}
            {post.content && (
              <p className="text-gray-300 p-4">{post.content}</p>
            )}

            <div className="flex items-center justify-between px-4 pb-4 text-gray-400 text-sm">
              {/* like button */}
              <button
                onClick={() => handleLike(post._id)}
                className={`text-sm transition ${
                  post.likes.includes(currentUser?._id)
                    ? 'text-red-500'
                    : 'text-gray-400'
                }`}
              >
                ❤️ {post.likes?.length || 0}
              </button>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllPosts;