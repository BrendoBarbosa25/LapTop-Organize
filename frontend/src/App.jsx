import { BrowserRouter, Routes, Route, Link } from "react-router-dom"

<<<<<<< HEAD
import Gestao from "./components"
=======
// páginas
import Gestao from "./pages/Gestao"
>>>>>>> 147416e0b564022e418af8a55d0212ed98414fe4
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