import { Route, Routes } from 'react-router-dom'
import './App.css'
import Dashbord from './Pages/Dashbord'

function App() {

  return (
    <Routes>
      <Route path='/dashboard' element={<Dashbord />}/>
    </Routes>
  )
}

export default App
