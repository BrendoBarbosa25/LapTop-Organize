import { useEffect, useState, useRef } from "react";
import InputField from "../components/InputField"
import Botao from "../components/BotaoEnviar"
import useAlunos from "../hooks/useAlunos"; // hook que faz comunicação com backend

function Gestao() {
    const nomeRef = useRef(null); // referencia pro input nome
    const [user, setUser] = useState({ // campos do formulário
        nome: "",
        email: "",
        senha: "",
        notebookId: ""
    });

    // mensagens locais do formulário
    const [erroForm, setErroForm] = useState("");
    const [sucessoForm, setSucessoForm] = useState(false);

    // salva o id do aluno que esta sendo editado
    const [indiceEditando, setIndiceEditando] = useState(null);

    const {    // dados e funções vindas do hook
        alunos,
        carregando,
        criarAluno,
        editarAluno,
        deletarAluno,
        erro,
        sucesso
    } = useAlunos();

    useEffect(() => {  // monitora sucesso vindo do hook

        if (sucesso) {

            setSucessoForm(true);

            // limpa formulário depois da operação
            setUser({
                nome: "",
                email: "",
                senha: "",
                notebookId: ""
            });

            // sai do modo edição
            setIndiceEditando(null);
        }

    }, [sucesso]);

    // limpa mensagem de sucesso depois de 4 segundos
    useEffect(() => {

        if (sucessoForm) {

            const timer = setTimeout(() => {

                setSucessoForm(false);

            }, 4000);

            return () => clearTimeout(timer);
        }

    }, [sucessoForm]);

    // envia formulário
    const handlerSubmit = async (e) => {

        e.preventDefault();

        setErroForm("");
        setSucessoForm(false);

        const nome = user.nome.trim();
        const email = user.email.trim();

        // ---- validações de NOME ----
        if (!nome) {
            setErroForm("Campo de nome é Obrigatório!");
            return;
        }

        if (nome.length < 3 || nome.length > 100) {
            setErroForm("Nome inválido, deve conter entre 3-100 caracteres");
            return;
        }

        const duplicataNome = alunos.find(a =>
            a.id !== indiceEditando &&
            a.nome.toLowerCase().trim() === nome.toLowerCase()
        );

        if (duplicataNome) {
            setErroForm("Usuário já cadastrado");
            return;
        }

        // ---- validações de EMAIL ----
        if (!email) {
            setErroForm("Campo de email é Obrigatório!");
            return;
        }

        if (email.split('.').length < 2 || email.split('@').length < 2) {
            setErroForm("Email inválido!");
            return;
        }

        const duplicataEmail = alunos.find(a =>
            a.id !== indiceEditando &&
            a.email.toLowerCase().trim() === email.toLowerCase()
        );

        if (duplicataEmail) {
            setErroForm("Usuário já cadastrado");
            return;
        }

        // ---- validações de SENHA ----
        if (!user.senha) {
            setErroForm("Campo de senha é obrigatório!");
            return;
        }

        if (user.senha.length < 7) {
            setErroForm("Senha inválida, mínimo de 7 caracteres");
            return;
        }

        if (!user.senha) {
            setErroForm("Campo de senha é obrigatório!");
            return;
        }

        // ---- validações de NOTEBOOK ----
        const numNotebook = Number(user.notebookId);

        if (isNaN(numNotebook) || numNotebook < 1 || numNotebook > 200) {
            setErroForm("Número do notebook inválido! Deve ser entre 1 e 200.");
            return;
        }

        const duplicataId = alunos.find(a =>
            a.id !== indiceEditando &&
            String(a.notebookId).trim() === String(user.notebookId).trim()
        );

        if (duplicataId) {
            setErroForm("Notebook indisponível");
            return;
        }

        // se estiver editando
        if (indiceEditando !== null) {

            await editarAluno(
                indiceEditando,
                user
            );

        } else {

            // cria aluno novo
            await criarAluno(user);
        }
    };
    // carrega dados do aluno no formulário
    const handlerEditar = (id) => {
        const registro = alunos.find(aluno => aluno.id === id);

        setUser({
            nome: registro.nome,
            email: registro.email,
            senha: "", // nunca reaproveita a senha existente
            notebookId: registro.notebookId
        });

        setIndiceEditando(id);

        if (nomeRef.current) {
            nomeRef.current.focus();
        }

        if (indiceEditando === null && !user.senha) {
            setErroForm("Campo de senha é Obrigatório!");
            return;
        }

        if (user.senha && user.senha.length < 7) {
            setErroForm("Senha inválida, deve conter mínimo de 7 caracteres");
            return;
        }
    };

    // deleta aluno selecionado
    const handlerDeletar = async (id, nome) => {
        const confirmou = window.confirm(`Excluir o cadastro de "${nome}"? Essa ação não pode ser desfeita.`);
        if (!confirmou) return;

        await deletarAluno(id);
    };

    return (

        <div className="dashboard-container management-page">

            <div className="form-card">
                <h2>
                    Cadastro de Alunos
                </h2>


                {carregando && (
                    <p className="status-message loading">
                        Carregando...
                    </p>
                )}

                <form onSubmit={handlerSubmit}>


                    {(erroForm || erro) && (

                        <p className="status-message error">
                            {erroForm || erro}
                        </p>
                    )}


                    {sucessoForm && (

                        <p className="status-message success">
                            Operação realizada com sucesso!
                        </p>
                    )}

                    <div className="form-grid">

                        <InputField
                            label="Nome: "
                            type="text"
                            name="nome"
                            placeholder="Portgas D. Ace"
                            value={user.nome}

                            onChange={(e) =>

                                setUser(dados => ({
                                    ...dados,
                                    nome: e.target.value
                                }))
                            }

                            inputRef={nomeRef}
                        />


                        <InputField
                            label="E-mail: "
                            type="email"
                            name="email"
                            placeholder="exemplo@email.com"
                            value={user.email}

                            onChange={(e) =>

                                setUser(dados => ({
                                    ...dados,
                                    email: e.target.value
                                }))
                            }
                        />


                        <InputField
                            label="Senha: "
                            type="password"
                            name="senha"
                            placeholder="Digite uma senha segura"
                            value={user.senha}

                            onChange={(e) =>

                                setUser(dados => ({
                                    ...dados,
                                    senha: e.target.value
                                }))
                            }
                        />


                        <InputField
                            label="Número: "
                            type="number"
                            name="notebookId"
                            placeholder="Ex: 32"
                            value={user.notebookId}

                            onChange={(e) =>

                                setUser(dados => ({
                                    ...dados,
                                    notebookId: e.target.value
                                }))
                            }
                        />
                    </div>


                    <div className="form-actions">

                        <Botao
                            texto={
                                indiceEditando !== null
                                    ? 'Atualizar'
                                    : 'Cadastrar'
                            }
                        />


                        {indiceEditando !== null && (

                            <button
                                type="button"
                                className="btn-cancel"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setIndiceEditando(null);
                                    setUser({
                                        nome: '',
                                        email: '',
                                        senha: '',
                                        notebookId: ''
                                    });

                                    setErroForm("");
                                    setSucessoForm(false);
                                }}
                            >
                                Cancelar edição
                            </button>
                        )}

                    </div>

                </form>
            </div>


            {/* último aluno cadastrado */}
            <div className="list-card">

                <h3>
                    Último Cadastrado
                </h3>

                {alunos.length > 0 ? (

                    (() => {
                        const ultimo = alunos[alunos.length - 1];

                        return (
                            <div className="aluno-item aluno-item--single">
                                <div className="aluno-info">
                                    <span className="aluno-name">Nome: {ultimo.nome}</span>
                                    <span className="aluno-sub"> | Email: {ultimo.email} | Notebook: N° {ultimo.notebookId}</span>
                                </div>
                                <div className="aluno-actions">
                                    <button onClick={() => handlerEditar(ultimo.id)} className="btn-edit">Editar</button>
                                    <button onClick={() => handlerDeletar(ultimo.id, ultimo.nome)} className="btn-delete">Deletar</button>
                                </div>
                            </div>
                        );
                    })()

                ) : (
                    <p className="empty-message">Nenhum aluno registrado até o momento.</p>
                )}
            </div>
        </div>
    );
}

export default Gestao;
