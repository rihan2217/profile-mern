import { useState } from 'react'
import Form from './components/Form'
import Read from './components/Read'
import Edit from './components/Edit'
import { Route, Routes } from 'react-router-dom'
import Login from './components/Login'
import Profile from './components/Profile'
import Post from './components/Post'
import AllPost from './components/AllPost'
import Navbar from './components/Navbar'
import CreatePost from './components/CreatePost'

function App() {

  return (
    <>
    <Navbar />
    <Routes>
      <Route path="/"        element={<Form/>} />
      <Route path="/login"    element={<Login />} /> 
      <Route path="/read"    element={<Read />} />
      <Route path="/profile"    element={<Profile />} />
      <Route path="/posts"    element={<AllPost />} />
      <Route path="/CreatePost"    element={<CreatePost />} />
      <Route path="/profile/:id"    element={<Profile />} />
      <Route path="/edit/:id" element={<Edit />} />
    </Routes>
    </>
  )
}

export default App
