import { useState } from 'react'
import Form from './components/Form'
import Read from './components/Read'
import Edit from './components/Edit'
import { Route, Routes } from 'react-router-dom'
import Login from './components/Login'

function App() {

  return (
    <>
    <Routes>
      <Route path="/"        element={<Form/>} />
      <Route path="/login"    element={<Login />} /> 
      <Route path="/read"    element={<Read />} />
      <Route path="/edit/:id" element={<Edit />} />
    </Routes>
    </>
  )
}

export default App
