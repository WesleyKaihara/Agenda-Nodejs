const mongoose = require('mongoose'); //Controla dados do MongoDB - banco de dados
const validator = require('validator');  //Biblioteca para validação de dados - ex: email

const AlunoSchema = new mongoose.Schema({    //tratar dados
  nome: { type: String, required: true },
  sobrenome: { type: String, required: true },
  email: { type: String, required: true },
  telefone: { type: String, required: false },
  criadoEm: { type: Date, default: Date.now },  //valor padrão
  turma: { type: String, required: true },
});
//Define o tipo de dados de cada variável, se é requirida, valor padrão

const AlunoModel = mongoose.model('Aluno', AlunoSchema);
//table no banco de dados

function Aluno(body) { //Variáveis da página de aluno 
  this.body = body; //valores dos inputs
  this.errors = [];  //Array vazio inicialmente pois não possuir erros
  this.aluno = null; //não possui nenhum usuário 
}

Aluno.buscaPorId = async function (id) {   //função estática 
  if (typeof id !== 'string') return;
  const aluno = await AlunoModel.findById(id);
  return aluno;
}

Aluno.buscaAlunos = async function () {   //função estática , apresenta colunas da tabela Aluno
  const alunos = await AlunoModel.find()
    .sort({ criadoEm: -1 }) //ordem decrescente
  return alunos;
}

Aluno.delete = async function (id) {   //função estática
  if (typeof id !== 'string') return;
  const aluno = await AlunoModel.findOneAndDelete({ _id: id })
  return aluno;
}

Aluno.prototype.register = async function () {  //Cria aluno
  this.valida();  //Valida os campos , caso haja campos requidos vazios ou incorretos
  if (this.errors.length > 0) return;  //Verifica Erros

  await this.userExists();

  if (this.errors.length > 0) return;  //Verifica Erros

  this.aluno = await AlunoModel.create(this.body) //Armazena no banco 
}

Aluno.prototype.userExists = async function () {  //Verifica se usuário existe

  this.aluno = await AlunoModel.findOne({ email: this.body.email }) //busca usuário com email recebido do input

  if (this.aluno) { //se encontrar algum valor no banco de dados
    this.errors.push('Usuário já existe');  //gera um erro
  }
}

Aluno.prototype.valida = function () {  //Valida dados
  this.cleanUp(); //Elimina valores antigos e substitui
  //Validação 
  //Email válido
  if (this.body.email && !validator.isEmail(this.body.email)) this.errors.push('E-mail inválido');  //Valida email
  if (!this.body.nome) this.errors.push('Nome é um campo obrigatório'); //Nome existe ou não
  if (!this.body.email && !this.body.telefone) {  //Verifica se email ou telefone existe
    this.errors.push('Pelo menos um contato precisa ser enviado : email ou telefone');//gera um erro
  }
  if (this.body.turma === undefined) { //Verifica se campo esta preenchido
    this.errors.push('Selecione uma Turma') //Gera erro
  }
}

Aluno.prototype.cleanUp = function () { //Elimina valores antigos e substitui
  for (const key in this.body) {
    if (typeof this.body[key] !== 'string') {
      this.body[key] = '';
    }
  }

  this.body = {  //Seta valores dos campos do usuário
    nome: this.body.nome,
    sobrenome: this.body.sobrenome,
    email: this.body.email,
    telefone: this.body.telefone,
    turma: this.body.turma
  }
}

Aluno.prototype.edit = async function (id) {  //Update de dados
  if (typeof id !== 'string') return;
  this.valida();
  if (this.errors.length > 0) return; //Verifica erros
  this.aluno = await AlunoModel.findByIdAndUpdate(id, this.body, { new: true });//Porcura coluna com valor da id e recebe novo valor do body
}

module.exports = Aluno;