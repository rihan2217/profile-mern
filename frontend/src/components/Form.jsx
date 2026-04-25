import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Form() {
  const [form, setform] = useState({ username: "", email: "", image: "" });
  const navigate = useNavigate();

  function handlechange(e) {
    setform({ ...form, [e.target.name]: e.target.value });
  }

  const handlesubmit = async (e) => {
    e.preventDefault();
    await axios.post("/api/create", form);
    navigate("/read");
  };

  return (
    <div className="h-screen bg-gray-800 text-gray-300 flex flex-col items-center justify-center">
      <h1 className=" p-4 bg-green-500 text-white text-3xl font-bold m-4">
        helloo gouyssss
      </h1>
      <div className="p-2 border-2 bg-gray-950 text-light-gray w-[40vw] h-[40vh] rounded">
        <form onSubmit={handlesubmit}>
          <div className="p-2 flex gap-4 justify-evenly ">
            <label className="w-1/3">Enter Your Username</label>
            <input
              className="p-2 w-2/3 text-black bg-white"
              type="text"
              placeholder="enter your username"
              name="username"
              onChange={handlechange}
            />
          </div>
          <div className="p-2 flex gap-4 ">
            <label className="w-1/3">Enter Your email</label>
            <input
              className="p-2 w-2/3 text-black bg-white"
              type="email"
              placeholder="enter your email"
              name="email"
              onChange={handlechange}
            />
          </div>
          <div className="p-2 flex gap-4 ">
            <label className="w-1/3">Enter Your image url</label>
            <input
              className="p-2 w-2/3 text-black bg-white"
              type="text"
              placeholder="profile img url"
              name="image"
              onChange={handlechange}
            />
          </div>
          <div className="m-2 flex gap-4 ">
            <button type="submit" className="mt-4 p-2 rounded bg-green-600 text-white">
              Create data
            </button>
            <button className="mt-4 p-2 rounded bg-green-600 text-white"onClick={() => navigate('/read')}>read profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Form;
