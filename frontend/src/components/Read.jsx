import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Read() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null); 
  const navigate = useNavigate();


  useEffect(() => {
    axios.get("/api/read").then((res) => setUsers(res.data));

    axios.get("/api/me", { withCredentials: true })
      .then((res) => setCurrentUser(res.data.user))
      .catch(() => setCurrentUser(null));
  }, []);

    const handleDelete = async (id) => {
    try {
        await axios.get(`/api/delete/${id}`, {
            withCredentials: true
        });
        navigate('/');  // ← always go to register after delete
    } catch(err) {
        alert(err.response?.data?.message || "Cannot delete this profile");
    }
  };

  const handleLogout = async () => {
    await axios.get("/api/logout", { withCredentials: true });
    navigate('/login');
  }

  return (
    <>
      <div className="bg-gray-800 text-gray-300 min-h-screen flex flex-col items-center p-6">
        <h1 className="p-4 bg-green-500 text-white text-3xl font-bold rounded-md mb-6">
          Show Users
        </h1>
        <button className="px-3 py-1 bg-red-500 rounded-md hover:bg-red-600 transition">
          <a href="/">back to form</a>
        </button>
        <button
            type="button"
            className="px-3 py-1 mt-4 bg-yellow-500 rounded-md hover:bg-yellow-600 transition"
            onClick={handleLogout}
        >
            Logout
        </button>
        <div className="grid m-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl">
         
          {users && users.length > 0 ?(
            users.map(user =>
            <div key={user._id} className="bg-gray-700 p-4 rounded-xl shadow-lg flex flex-col items-center hover:bg-gray-600 transition">
            <img src={`${user.image}`} className="w-48 h-48 object-cover rounded-full mb-4 " />
            <h1 className="text-xl font-semibold mb-1">{user.username}</h1>
            <h2 className="text-gray-300 mb-4">{user.email}</h2>
            {currentUser && currentUser.id === user._id && (
                <div className="flex gap-4">
                  <button 
                    className="px-3 py-1 bg-blue-500 rounded-md hover:bg-blue-600 transition"
                    onClick={() => navigate(`/edit/${user._id}`)}>
                    Update Profile
                  </button>
                  <button 
                    className="px-3 py-1 bg-red-500 rounded-md hover:bg-red-600 transition"
                    onClick={() => handleDelete(user._id)}>
                    Delete Profile
                  </button>
                </div>
              )}
          </div>
          )):(
          <p className="text-2xl text-white">loading ... </p>
          )}
        </div>
      </div>
    </>
  );
}

export default Read;
