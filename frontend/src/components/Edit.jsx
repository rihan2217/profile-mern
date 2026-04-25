import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'

function Edit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', image: '' })

  useEffect(() => {
    axios.get(`/api/edit/${id}`).then(res => setForm(res.data))
  }, [id])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    await axios.post(`/api/update/${id}`, form,{
        withCredentials: true  
    })
    navigate('/read')
  }

  return (
    <div className="h-screen bg-gray-800 text-gray-300 flex flex-col items-center justify-center">
        <h1 className=" p-4 bg-green-500 text-white text-3xl font-bold m-4">
            Update Profile
        </h1>
        <div className="p-2 border-2 m-4 bg-gray-950 text-light-gray min-w-[40vw] min-h-[40vh] rounded">
            <form onSubmit={handleSubmit}>
                <div className="p-2 flex gap-4 justify-evenly ">
                    <label className="w-1/3">Enter Your Username</label>
                    <input className="p-2 w-2/3 text-black bg-white" type="text" placeholder="enter your username" value={`${form.username}`} 
                    onChange={handleChange} name="username"/>
                </div>
                <div className="p-2 flex gap-4 ">
                    <label className="w-1/3">Enter Your email</label>
                    <input className="p-2 w-2/3 text-black bg-white" type="email" placeholder="enter your email" value={`${form.email}`} 
                    onChange={handleChange} name="email"/>
                </div>
                <div className="p-2 flex gap-4 ">
                    <label className="w-1/3">Enter Your image url</label>
                    <input className="p-2 w-2/3 text-black bg-white" type="text" placeholder="profile img url" value={`${form.image}`} 
                    onChange={handleChange} name="image"/>
                </div>
                <div className="m-2 flex gap-4 ">
                    <button className="mt-4 p-2 rounded bg-green-600 text-white" type='submit'>Update data</button>
                    <button type="button" className="mt-4 p-2 rounded bg-green-600 text-white" onClick={() => navigate('/read')}>read profile</button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default Edit