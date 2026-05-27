import express from 'express'
import cors from 'cors'


const servidor = express()
servidor.use(cors())
servidor.use(express.json())

const registros = []

servidor.post('/registros', (req, res) => {
    const dados = req.body // pega o corpo da requisição
    const duplicataNome = registros.find(r => r.nome.toLowerCase().trim() === dados.nome.toLowerCase().trim())
    const duplicataEmail = registros.find(r => r.email.toLowerCase().trim() === dados.email.toLowerCase().trim())
    const duplicataId = registros.find(r => r.notebookId.trim() === dados.notebookId.trim())


    if (!dados.nome) {
        return res.status(400).json({
            erro: "Campo de nome é Obrigatório!"
        })
        
    } else if(dados.nome.length > 100 || dados.nome.length < 3) {
        return res.status(400).json({
            erro: "Nome inválido, deve conter entre 3-100 caracteres"
        })
    } else if (duplicataNome) {
        return res.status(409).json({
            erro: "Usuário já cadastrado"
        })
    } 

    if (!dados.email) {
        return res.status(400).json({
            erro: "Campo de email é Obrigatório!"
        })
    } else if (dados.email.split('.').length < 2 || dados.email.split('@').length < 2) {
        return res.status(400).json({
            erro: "Email inválido!"
        })
    } else if (duplicataEmail) {
        return res.status(409).json({
            erro: "Usuário já cadastrado"
        })
    } 

    if (!dados.senha) {
        return res.status(400).json({
            erro: "Campo de senha é Obrigatório!"
        })
    } else if (dados.senha.length < 7) {
        return res.status(400).json({
            erro: "Senha inválida, deve conter mínimo de 7 caracteres"
        })
    }

    if (!dados.notebookId) {
        return res.status(400).json({
            erro: "Número do notebook inválido!"
        })
    } else if (duplicataId) {
        return res.status(409).json({
            erro: "Notebook indisponível"
        })
    } else if(dados.notebookId < 1 || dados.notebookId > 200) {
        return res.status(400).json({
            erro: "Número do notebook inválido!"
        })
    }

    console.log(`Dados da requisição!
        O que tem no corpo que o front end me mandou : ${dados}`)
    if (registros.length > 0) {
        dados.id = registros[registros.length - 1].id + 1
    } else {
        dados.id = 1
    }
    registros.push(dados) // simulando salvar dados no banco


    res.status(201).json({
        sucesso: true,
        mensagem: "Registro Criado Com Sucesso!",
        dados: dados
    })

})

servidor.get("/registros", (req, res) => {
    res.status(200).json(registros)
})

servidor.delete("/registros/:id", (req, res) => {
    const id = parseInt(req.params.id)

    if (id < 0 || id >= registros.length) {
        return res.status(404).json({erro: "Aluno não encontrado!"})
    }

    registros.splice(id, 1)
    res.status(200).json({ mensagem: "Aluno removido"})
})

servidor.put("/registros/:id", (req, res) => {
    const id = parseInt(req.params.id)
    const dados = req.body

    if (id < 0 || id >= registros.length) {
        return res.status(404).json({erro: "Registro não encontrado!"})
    }
    if (!dados.nome || dados.nome.trim() === "") {
        return res.status(400).json({erro: "Nome é obrigatório"})
    }

    registros[id] = dados
    res.status(200).json({mensagem: "Registro Atualizado com Sucesso!", dados: registros[id]})
})

servidor.get("/", (req,res) => (
    res.status(200).json({
        mensagem: "Servidor está ligado",
        status: "Funcional"
    })
))

servidor.listen(3000, () =>{
    console.log('Servidor hospedado em  '+ 'http://localhost:3000')
})