//Página Inicial do sistema 
//São apresentados os contatos de acordo com a session
//http://localhost:3000


const Contato = require('../models/ContatoModel')

exports.index = async (req, res) => {
  const contatos = await Contato.buscaContatos()
  res.render('index', { contatos })
}

