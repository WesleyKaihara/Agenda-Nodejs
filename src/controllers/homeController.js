//Página Inicial do sistema 
//São apresentados os contatos de acordo com a session
//http://localhost:3000


const Aluno = require('../models/AlunoModel')

exports.index = async (req, res) => {
  const alunos = await Aluno.buscaAlunos()
  res.render('index', { alunos })
}

