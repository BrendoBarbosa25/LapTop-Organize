function Dashboard() {

  // dados mockados por enquanto
  const totalAlunos = 35
  const notebooksOcupados = 35
  const notebooksLivres = 165

  return (
    <div className="dashboard-container">

      <h1>Dashboard</h1>

      {/* cards */}
      <div className="cards">

        {/* total alunos */}
        <div className="card">

          <div className="card-icon blue">

            <img
              src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png"
              alt="alunos"
            />

          </div>

          <div>
            <h2>Total de alunos</h2>

            <p className="blue-text">
              {totalAlunos}
            </p>
          </div>

        </div>

        {/* ocupados */}
        <div className="card">

          <div className="card-icon red">

            <img
              src="https://cdn-icons-png.flaticon.com/512/3474/3474360.png"
              alt="ocupados"
            />

          </div>

          <div>
            <h2>Notebooks ocupados</h2>

            <p className="red-text">
              {notebooksOcupados}
            </p>
          </div>

        </div>

        {/* livres */}
        <div className="card">

          <div className="card-icon green">

            <img
              src="https://cdn-icons-png.flaticon.com/512/3474/3474360.png"
              alt="livres"
            />

          </div>

          <div>
            <h2>Notebooks livres</h2>

            <p className="green-text">
              {notebooksLivres}
            </p>
          </div>

        </div>

      </div>

    </div>
  )
}

export default Dashboard