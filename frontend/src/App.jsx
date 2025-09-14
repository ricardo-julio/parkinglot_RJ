import {Routes, Route} from 'react-router-dom'

// pages
import Login from "./pages/login"
import Home from './pages/home'
import Register from './pages/register'

// components
import { Authprovider } from './components/AuthContext'
import LayaoutNav from './components/layaoutNav'
import ProtectedRoutes from './components/ProtectedRoutes'
function App() {

  return (
    <Authprovider>
       <Routes>
      <Route path="/" element={<Login />} />

      <Route path='/home' element={<ProtectedRoutes><LayaoutNav /></ProtectedRoutes>}>
         <Route index element={<Home />} />
         <Route path='register' element={<Register />} />
      </Route>
    </Routes>
    </Authprovider>
  )
}

export default App
