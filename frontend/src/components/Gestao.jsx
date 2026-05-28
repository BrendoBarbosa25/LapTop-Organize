import { useEffect, useState, useRef } from "react";
import InputField from "./inputField";
import Botao from "./BotaoEnviar";
import useAlunos from "../hooks/useRegistros";

function Gestao() {
    const nomeRef = useRef(null);

    // Campos Necessários
    const [user, setUser] = useState({ nome: "", email: "", senha: "", notebookId: "" });
    const [erroForm, setErroForm] = useState("");
    const [sucessoForm, setSucessoForm] = useState(false);
    const [indiceEditando, setIndiceEditando] = useState(null);

    // Puxando funções do useAlunos
    const { alunos, carregando, criarAluno, editarAluno, deletarAluno, erro, sucesso } = useAlunos();

    // Sincroniza as mensagens de sucesso/erro do useAlunos
    useEffect(() => {
        if (sucesso) {
            setSucessoForm(true);
            // Limpa o formulário após o sucesso
            setUser({ nome: "", email: "", senha: "", notebookId: "" });
            setIndiceEditando(null);
        }
    }, [sucesso]);

    const handlerSubmit = async (e) => {
        e.preventDefault();
        setErroForm("");
        setSucessoForm(false);

        // Validação senha minimo de caracter
        if (user.senha.length < 7) {
            setErroForm("Senha inválida, deve conter mínimo de 7 caracteres");
            return;
        }

        // Validação do Notebook ID 
        const numNotebook = parseInt(user.notebookId);
        if (isNaN(numNotebook) || numNotebook < 1 || numNotebook > 200) {
            setErroForm("Número do notebook inválido! Deve ser entre 1 e 200.");
            return;
        }

        if (indiceEditando !== null) {
            // No backend em memória, o ID usado na rota PUT/DELETE é a própria posição (index) do array
            await editarAluno(indiceEditando, user);
        } else {
            await criarAluno(user);
        }
    };

    const handlerEditar = (index) => {
        const registro = alunos[index];
        setUser({
            nome: registro.nome,
            email: registro.email,
            senha: registro.senha || "",
            notebookId: registro.notebookId
        });

        setIndiceEditando(index);
        if (nomeRef.current) nomeRef.current.focus();
    };

    const handlerDeletar = async (index) => {
        await deletarAluno(index);
    };

    return (
        <div style={{ padding: '20px', color: '#fff', backgroundColor: '#222' }}>
            <h2>Formulário de Cadastro (Alunos)</h2>

            {carregando && <p style={{ color: 'yellow' }}>Carregando...</p>}

            <form onSubmit={handlerSubmit}>
                {/* Mostra erros locais do formulário ou erros vindos direto do servidor através do hook */}
                {(erroForm || erro) && <p style={{ color: 'red' }}>{erroForm || erro}</p>}
                {sucessoForm && <p style={{ color: 'green' }}>Operação realizada com sucesso!</p>}

                <InputField
                    label="Nome: "
                    type="text"
                    name="nome"
                    placeholder="Portgas D. Ace"
                    value={user.nome}
                    onChange={(e) => setUser(dados => ({ ...dados, nome: e.target.value }))}
                    inputRef={nomeRef}
                />

                <InputField
                    label="E-mail: "
                    type="email"
                    name="email"
                    placeholder="exemplo@email.com"
                    value={user.email}
                    onChange={(e) => setUser(dados => ({ ...dados, email: e.target.value }))}
                />


                <InputField
                    label="Senha: "
                    type="password"
                    name="senha"
                    placeholder="Digite uma senha segura"
                    value={user.senha}
                    onChange={(e) => setUser(dados => ({ ...dados, senha: e.target.value }))}
                />


                <InputField
                    label="Número: "
                    type="number"
                    name="notebookId"
                    placeholder="Ex: 32"
                    value={user.notebookId}
                    onChange={(e) => setUser(dados => ({ ...dados, notebookId: e.target.value }))}
                />

                <div style={{ marginTop: '15px' }}>
                    <Botao texto={indiceEditando !== null ? 'Atualizar' : 'Cadastrar'} />
                    {indiceEditando !== null && (
                        <button
                            type="button"
                            style={{ marginLeft: '10px' }}
                            onClick={() => {
                                setIndiceEditando(null);
                                setUser({ nome: '', email: '', senha: '', notebookId: '' });
                                setErroForm("");
                            }}
                        >
                            Cancelar edição
                        </button>
                    )}
                </div>
            </form>

            <div style={{ marginTop: '30px' }}>
                <h3>Alunos Cadastrados</h3>
                {alunos.length > 0 ? (
                    <ul>
                        {alunos.map((item, index) => (
                            <li key={index} style={{ marginBottom: '15px' }}>
                                <strong>{item.nome}</strong> - {item.email} (Notebook Nº: {item.notebookId})

                                <div style={{
                                    border: '2px solid #F4FF5B',
                                    borderRadius: '4px',
                                    padding: '6px',
                                    boxShadow: '0 0 10px #F4FF5B',
                                    marginTop: '5px',
                                    display: 'inline-block'
                                }}>
                                    <button onClick={() => handlerDeletar(index)} style={{ marginRight: '5px' }}>
                                        Deletar
                                    </button>
                                    <button onClick={() => handlerEditar(index)}>
                                        Editar
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Nenhum aluno registrado até o momento.</p>
                )}
            </div>
        </div>
    );
}

export default Gestao;
