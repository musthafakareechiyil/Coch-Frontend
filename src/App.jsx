import { Route, Routes, useNavigate, Link } from 'react-router-dom'
import './App.css'
import Dashbord from './Pages/Dashbord'
import Login from './Pages/Login'
import ProtectedRoute from './Components/protectedRoute'
import PublicRoute from './Components/publicRoute'
import KpisDashbaord from './Pages/KpisDashbaord'
import { FiLogOut } from 'react-icons/fi'

function App() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation Bar */}
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                {/* Logo linking to dashboard */}
                <Link to="/dashboard" className="flex-shrink-0 flex items-center">
                  <img
                    className="h-16 w-auto"
                    src="https://img.freepik.com/premium-vector/caduceus-medical-snake-logo-icon-vector-eps-isolated-white_1287994-751.jpg?w=740"
                    alt="Survey App Logo"
                  />
                  <span className="ml-2 text-xl font-semibold text-gray-800 hidden sm:block">
                    SurveyApp
                  </span>
                </Link>
              </div>
              
              {/* Logout button (shown only when authenticated) */}

              <div className="flex items-center">
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <FiLogOut className="mr-1" />
                    Logout
                  </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto">
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
              <Route path="/survey/:id/kpis" element={<KpisDashbaord />} />
            </Route>
          </Routes>
        </main>
      </div>
    </>
  )
}

export default App