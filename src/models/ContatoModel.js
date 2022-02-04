const mongoose = require('mongoose'); //Controla dados do MongoDB - banco de dadoss
const validator = require('validator');  //Biblioteca para validação de dados - ex: email

const ContatoSchema = new mongoose.Schema({    //tratar dados
  nome: { type: String, required: true },
  sobrenome: { type: String, required: false, default: '' },
  email: { type: String, required: false, default: '' },
  telefone: { type: String, required: false, default: '' },
  criadoEm: { type: Date, default: Date.now },
});
//Define o tipo de dados de cada variável, se é requirida, valor padrão

const ContatoModel = mongoose.model('Contato', ContatoSchema);
//table no banco de dados

function Contato(body) { //Variáveis da página de contato 
  this.body = body; //valores dos inputs
  this.errors = [];  //Array vazio inicialmente pois não possuir erros
  this.contato = null; //não possui nenhum usuário 
}

Contato.buscaPorId = async function (id) {   //função estática 
  if (typeof id !== 'string') return;
  const contato = await ContatoModel.findById(id);
  return contato;
}

Contato.buscaContatos = async function () {   //função estática 
  const contatos = await ContatoModel.find()
    .sort({ criadoEm: -1 }) //ordem decrescente
  return contatos;
}

Contato.delete = async function (id) {   //função estática
  if (typeof id !== 'string') return;
  const contato = await ContatoModel.findOneAndDelete({ _id: id })
  return contato;
}

Contato.prototype.register = async function () {  //Cria contato
  this.valida();  //Valida os campos , caso haja campos requidos vazios ou incorretos
  if (this.errors.length > 0) return;  //Verifica Erros
  this.contato = await ContatoModel.create(this.body) //Armazena no banco 
}

Contato.prototype.valida = function () {  //Valida dados
  this.cleanUp(); //Elimina valores antigos e substitui
  //Validação 
  //Email válido
  if (this.body.email && !validator.isEmail(this.body.email)) this.errors.push('E-mail inválido');  //Valida email
  if (!this.body.nome) this.errors.push('Nome é um campo obrigatório'); //Nome existe ou não
  if (!this.body.email && !this.body.telefone) {  //Verifica se email ou telefone existe
    this.errors.push('Pelo menos um contato precisa ser enviado : email ou telefone');
  }


}

Contato.prototype.cleanUp = function () { //Elimina valores antigos e substitui
  for (const key in this.body) {
    if (typeof this.body[key] !== 'string') {
      this.body[key] = '';
    }
  }

  this.body = {
    nome: this.body.nome,
    sobrenome: this.body.sobrenome,
    email: this.body.email,
    telefone: this.body.telefone,
  }
}

Contato.prototype.edit = async function (id) {  //Update de dados
  if (typeof id !== 'string') return;
  this.valida();
  if (this.errors.length > 0) return; //Verifica erros
  this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, { new: true })
}



module.exports = Contato;