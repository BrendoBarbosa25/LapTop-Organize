import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import Gestao from "./components/Gestao"
import Dashboard from "./pages/Dashboard"

function App() {
  return (
    <BrowserRouter>

      {/* navbar */}
      <nav className="navbar">

        {/* logo */}
        <div className="logo">

          <span className="logo-symbol">
            #
          </span>

          <span className="logo-text">
            CERQUILHA
          </span>

        </div>

        {/* links */}
        <div className="nav-links">

          <Link to="/">
            Gestão
          </Link>

          <Link to="/dashboard">
            Dashboard
          </Link>

        </div>

      </nav>

      {/* rotas */}
      <Routes>

        {/* página principal */}
         <Route path="/" element={<Gestao />} /> 

        {/* dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

      </Routes>

    </BrowserRouter>
    
  )
}

export default App