import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams(); // ✅ get id from URL if visiting someone else's profile

  useEffect(() => {
    // ✅ always fetch logged in user
    axios.get("/api/profile", { withCredentials: true })
      .then((res) => {
        setCurrentUser(res.data);

        // if no id in URL → it's own profile
        if (!id || id === res.data._id) {
          setUser(res.data);
          setIsOwner(true);
        }
      })
      .catch(() => navigate('/login'));

    // ✅ if id in URL → fetch that user's profile
    if (id) {
      axios.get(`/api/user/${id}`, { withCredentials: true })
        .then((res) => setUser(res.data))
        .catch(() => navigate('/'));
    }
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;
    try {
      await axios.delete(`/api/delete/${user._id}`, { withCredentials: true });
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || "Cannot delete");
    }
  };

  const handleDeletePost = async (postId) => {
  if (!window.confirm("Delete this post?")) return;
  try {
    await axios.delete(`/api/post/${postId}`, { withCredentials: true });
    
    // ✅ safely update UI
    setUser((prev) => ({
      ...prev,
      post: (prev.post || []).filter((p) => p._id !== postId),
    }));
  } catch (err) {
    alert(err.response?.data?.message || "Cannot delete post");
  }
};

const handleLike = async (postId) => {
  try {
    await axios.post(`/api/post/like/${postId}`, {}, { withCredentials: true });
    
    // ✅ update user.post not posts state
    setUser((prev) => ({
      ...prev,
      post: prev.post.map((post) => {
        if (post._id !== postId) return post;
        const alreadyLiked = post.likes.includes(currentUser._id);
        return {
          ...post,
          likes: alreadyLiked
            ? post.likes.filter((id) => id !== currentUser._id)
            : [...post.likes, currentUser._id],
        };
      }),
    }));
  } catch (err) {
    console.error(err);
  }
};

  const handleLogout = async () => {
    await axios.get("/api/logout", { withCredentials: true });
    navigate('/login');
  };

  if (!user) return <p className="text-white text-center mt-10">Loading...</p>;

  return (
    <div className="bg-gray-800 text-gray-300 min-h-screen flex flex-col items-center p-6">

      {/* Profile Header */}
      <div className="flex flex-col items-center bg-gray-700 rounded-xl p-6 w-full max-w-md shadow-lg">
        <img
          src={user.image || '/default-avatar.png'}
          className="w-32 h-32 object-cover rounded-full mb-4 border-4 border-green-500"
          alt={user.username}
        />
        <h1 className="text-2xl font-bold text-white mb-1">{user.username}</h1>
         {isOwner && (<h2 className="text-gray-400 mb-4">{user.email}</h2>)}
        <p className="text-gray-400 text-sm">{user.post?.length || 0} posts</p>

        {/* ✅ only show buttons if it's own profile */}
        {isOwner && (
          <div className="flex flex-wrap gap-3 mt-4 justify-center">
            <button
              className="px-4 py-1.5 bg-blue-500 rounded-md hover:bg-blue-600 transition"
              onClick={() => navigate(`/edit/${user._id}`)}
            >
              Update Profile
            </button>
            <button
              className="px-4 py-1.5 bg-red-500 rounded-md hover:bg-red-600 transition"
              onClick={handleDelete}
            >
              Delete Account
            </button>
            <button
              className="px-4 py-1.5 bg-yellow-500 rounded-md hover:bg-yellow-600 transition"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Posts */}
      <div className="w-full max-w-3xl mt-8">
        <h2 className="text-xl font-semibold text-white mb-4">
          {isOwner ? 'My Posts' : `${user.username}'s Posts`}
        </h2>

        {user.post && user.post.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {user.post.map((post) => (
              <div key={post._id} className="bg-gray-700 rounded-xl overflow-hidden shadow-lg">

                {post.image && (
                  <img src={post.image} className="w-full object-cover max-h-60" alt="post" />
                )}
                {post.content && (
                  <p className="text-gray-300 p-4">{post.content}</p>
                )}

                <div className="flex items-center justify-between px-4 pb-4 text-gray-400 text-sm">
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

                  {/* ✅ delete post only if own profile */}
                  {isOwner && (
                    <button
                      onClick={() => handleDeletePost(post._id)}
                      className="text-red-400 hover:text-red-500 transition text-sm"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No posts yet.</p>
        )}
      </div>
    </div>
  );
}

export default Profile;