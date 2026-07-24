import express from 'express'
import cors from 'cors'
import { d1Query } from './db.js'

const servidor = express()
servidor.use(cors())
servidor.use(express.json())

// pega qualquer erro não tratado nas rotas async e devolve como JSON
function comTratamentoDeErro(rota) {
    return async (req, res) => {
        try {
            await rota(req, res)
        } catch (e) {
            console.error("Erro na rota:", e.message)
            res.status(500).json({ erro: "Erro interno no servidor. Tente novamente." })
        }
    }
}

// Rota de POST
servidor.post('/registros', comTratamentoDeErro(async (req, res) => {
    const dados = req.body

    //Checagens de válidade do nome do usuário
    if (!dados.nome || dados.nome.trim() === "") {
        return res.status(400).json({ erro: "Campo de nome é Obrigatório!" })
    } else if (dados.nome.length > 100 || dados.nome.length < 3) {
        return res.status(400).json({ erro: "Nome inválido, deve conter entre 3-100 caracteres" })
    }

    if (!dados.email) {
        return res.status(400).json({ erro: "Campo de email é Obrigatório!" })
    } else if (dados.email.split('.').length < 2 || dados.email.split('@').length < 2) {
        return res.status(400).json({ erro: "Email inválido!" })
    }

    if (!dados.senha) {
        return res.status(400).json({ erro: "Campo de senha é Obrigatório!" })
    } else if (dados.senha.length < 7) {
        return res.status(400).json({ erro: "Senha inválida, deve conter mínimo de 7 caracteres" })
    }

    if (!dados.notebookId) {
        return res.status(400).json({ erro: "Número do notebook inválido!" })
    } else if (dados.notebookId < 1 || dados.notebookId > 200) {
        return res.status(400).json({ erro: "Número do notebook inválido!" })
    }

    // checagens de duplicidade — agora consultando o D1
    const duplicataNome = await d1Query(
        'SELECT id FROM registros WHERE nome = ? COLLATE NOCASE',
        [dados.nome.trim()]
    )
    if (duplicataNome.length > 0) {
        return res.status(409).json({ erro: "Usuário já cadastrado" })
    }

    const duplicataEmail = await d1Query(
        'SELECT id FROM registros WHERE email = ? COLLATE NOCASE',
        [dados.email.trim()]
    )
    if (duplicataEmail.length > 0) {
        return res.status(409).json({ erro: "Usuário já cadastrado" })
    }

    const duplicataId = await d1Query(
        'SELECT id FROM registros WHERE notebookId = ?',
        [dados.notebookId]
    )
    if (duplicataId.length > 0) {
        return res.status(409).json({ erro: "Notebook indisponível" })
    }

    await d1Query(
        'INSERT INTO registros (nome, email, senha, notebookId) VALUES (?, ?, ?, ?)',
        [dados.nome.trim(), dados.email.trim(), dados.senha, dados.notebookId]
    )

    res.status(201).json({
        sucesso: true,
        mensagem: "Registro Criado Com Sucesso!"
    })
}))

// Rota de GET
servidor.get("/registros", comTratamentoDeErro(async (req, res) => {
    const dados = await d1Query('SELECT id, nome, email, notebookId FROM registros')
    res.status(200).json(dados)
}))

// Rota DELETE
servidor.delete("/registros/:id", comTratamentoDeErro(async (req, res) => {
    const id = parseInt(req.params.id)

    const existente = await d1Query('SELECT id FROM registros WHERE id = ?', [id])
    if (existente.length === 0) {
        return res.status(404).json({ erro: "Aluno não encontrado!" })
    }

    await d1Query('DELETE FROM registros WHERE id = ?', [id])
    res.status(200).json({ mensagem: "Aluno removido" })
}))

// Rota PUT
servidor.put("/registros/:id", comTratamentoDeErro(async (req, res) => {
    const id = parseInt(req.params.id)
    const dados = req.body

    const registroAtual = await d1Query('SELECT * FROM registros WHERE id = ?', [id])
    if (registroAtual.length === 0) {
        return res.status(404).json({ erro: "Registro não encontrado!" })
    }

    //Checagens de válidade do nome do usuário
    if (!dados.nome || dados.nome.trim() === "") {
        return res.status(400).json({ erro: "Campo de nome é Obrigatório!" })
    } else if (dados.nome.length > 100 || dados.nome.length < 3) {
        return res.status(400).json({ erro: "Nome inválido, deve conter entre 3-100 caracteres" })
    }

    if (!dados.email) {
        return res.status(400).json({ erro: "Campo de email é Obrigatório!" })
    } else if (dados.email.split('.').length < 2 || dados.email.split('@').length < 2) {
        return res.status(400).json({ erro: "Email inválido!" })
    }

    // senha é opcional na edição: vazio = mantém a senha atual
    if (dados.senha && dados.senha.length < 7) {
        return res.status(400).json({ erro: "Senha inválida, deve conter mínimo de 7 caracteres" })
    }

    if (!dados.notebookId) {
        return res.status(400).json({ erro: "Número do notebook inválido!" })
    } else if (dados.notebookId < 1 || dados.notebookId > 200) {
        return res.status(400).json({ erro: "Número do notebook inválido!" })
    }

    // duplicidade, excluindo o próprio registro
    const duplicataNome = await d1Query(
        'SELECT id FROM registros WHERE nome = ? COLLATE NOCASE AND id != ?',
        [dados.nome.trim(), id]
    )
    if (duplicataNome.length > 0) {
        return res.status(409).json({ erro: "Usuário já cadastrado" })
    }

    const duplicataEmail = await d1Query(
        'SELECT id FROM registros WHERE email = ? COLLATE NOCASE AND id != ?',
        [dados.email.trim(), id]
    )
    if (duplicataEmail.length > 0) {
        return res.status(409).json({ erro: "Usuário já cadastrado" })
    }

    const duplicataId = await d1Query(
        'SELECT id FROM registros WHERE notebookId = ? AND id != ?',
        [dados.notebookId, id]
    )
    if (duplicataId.length > 0) {
        return res.status(409).json({ erro: "Notebook indisponível" })
    }

    const senhaFinal = dados.senha ? dados.senha : registroAtual[0].senha

    await d1Query(
        'UPDATE registros SET nome = ?, email = ?, senha = ?, notebookId = ? WHERE id = ?',
        [dados.nome.trim(), dados.email.trim(), senhaFinal, dados.notebookId, id]
    )

    res.status(200).json({ mensagem: "Registro Atualizado com Sucesso!" })
}))

// Mensagem básica da página principal do servidor
servidor.get("/", (req, res) => (
    res.status(200).json({
        mensagem: "Servidor está ligado",
        status: "Funcional"
    })
))

servidor.listen(3000, () => {
    console.log('Servidor hospedado em  ' + 'http://localhost:3000')
})