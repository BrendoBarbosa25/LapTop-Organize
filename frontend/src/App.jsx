import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import Gestao from "./components/Gestao"
import Dashboard from "./components/Gestao"

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


/*
REACT ROUTER

Nesse arquivo fica a parte de navegação do sistema

O React Router foi usado pra separar as telas do projeto e permitir trocar de página sem
precisar recarregar o site.

As rotas atuais são:

"/"
abre a tela de Gestão

"/dashboard"
abre a tela Dashboard

O BrowserRouter envolve toda aplicação
pra ativar o sistema de rotas.

O Routes organiza todas as rotas existentes.

Cada Route define:
- o caminho da URL
- qual componente será aberto

O Link foi usado nos botões da navbar
pra navegar entre as páginas de forma rápida
e sem reload.

Quando o usuário clica em algum link,
o React Router identifica a rota e renderiza
somente o componente necessário.

Isso deixou a navegação mais fluida e o projeto mais organizado.

*/
