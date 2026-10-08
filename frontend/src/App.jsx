import { Routes, Route } from 'react-router-dom'

// local imports
import './App.css'
import Home from './pages/Home'
import ReportItem from './pages/ReportItem'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/report' element={<ReportItem />} />
      </Routes>
    </>
  )
}

export default App
