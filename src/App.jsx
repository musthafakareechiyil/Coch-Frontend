import { Route, Routes } from 'react-router-dom'
import './App.css'
import Dashbord from './Pages/Dashbord'
import Login from './Pages/Login'
import ProtectedRoute from './Components/protectedRoute'
import PublicRoute from './Components/publicRoute'

function App() {

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route element={<ProtectedRoute />}>
        <Route path='/dashboard' element={<Dashbord />}/>
      </Route>
    </Routes>
  )
}

export default App
