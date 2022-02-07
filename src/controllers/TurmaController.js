const Aluno = require('../models/AlunoModel')
const Notas = require('../models/NotasModel')


exports.index = async (req, res) => {
  const alunos = await Aluno.buscaAlunos()
  res.render('alunosShow', { alunos });
}
