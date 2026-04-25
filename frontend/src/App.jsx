import { useState } from 'react'
import Form from './components/form'
import Read from './components/Read'
import Edit from './components/Edit'
import { Route, Routes } from 'react-router-dom'

function App() {

  return (
    <>
    <Routes>
      <Route path="/"        element={<Form/>} />
      <Route path="/read"    element={<Read />} />
      <Route path="/edit/:id" element={<Edit />} />
    </Routes>
    </>
  )
}

export default App
