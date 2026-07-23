// hook dos alunos
import useAlunos from "../hooks/useAlunos"

function Dashboard() {

  // dados vindos do hook
  const {
    alunos,
    carregando,
    erro
  } = useAlunos()

  // estatísticas vindas do hook
  const totalAlunos = alunos.length
  const notebooksOcupados = alunos.length
  const notebooksLivres = 200 - alunos.length

  return (
    <div className="dashboard-container">

      <h1>Dashboard</h1>

      {/* loading */}
      {carregando && (
        <p>Carregando dados...</p>
      )}

      {/* erro */}
      {erro && (
        <p>{erro}</p>
      )}

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

            {/* lista completa de alunos */}
            <div className="list-card list-card--full">

              <h3>
                Alunos Cadastrados
              </h3>

              {alunos.length > 0 ? (

                <ul className="alunos-list">

                  {alunos.map((item) => (
                    <li key={item.id} className="aluno-item">
                      <div className="aluno-info">
                        <span className="aluno-name">Nome: {item.nome}</span>
                        <span className="aluno-sub"> | Email: {item.email} | Notebook: N° {item.notebookId}</span>
                      </div>
                    </li>
                  ))}

                </ul>

              ) : (
                <p className="empty-message">Nenhum aluno registrado até o momento.</p>
              )}
            </div>
      </div>

    </div>
  )
}

export default Dashboard