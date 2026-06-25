import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="*" element={<Layout />} />
    </Routes>
  )
}

export default App
