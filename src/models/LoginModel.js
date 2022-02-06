const mongoose = require('mongoose');//Controla dados do MongoDB - banco de dados
const validator = require('validator');//Biblioteca para validação de dados - ex: email
const bcryptjs = require('bcryptjs');//criptografia de senha

const LoginSchema = new mongoose.Schema({    //tratar dados - tudo requerido
  email: { type: String, required: true },
  password: { type: String, required: true },
  cargo: { type: String, required: true }
});

const LoginModel = mongoose.model('Login', LoginSchema); //table no banco de dados

class Login {
  constructor(body) {   //recebe dados dos inputs
    this.body = body;
    this.errors = []; //erros começam vazios 
    this.user = null; //sem usuário inicialmente
    this.cargo = undefined; //sem cargo
  }

  async login() {
    this.valida(); //valida os campos,email valido e tamanho da senha

    if (this.errors.lenth > 0) return;  //caso haja, retorna um erro 

    this.user = await LoginModel.findOne({ email: this.body.email });  //verifica se usuario ja existe

    if (!this.user) {  //se não encontrar no banco de dados
      this.errors.push('Usuário não existe');//adiciona um erro
      return;
    }

    if (!bcryptjs.compareSync(this.body.password, this.user.password)) { //verifica se senha esta correta
      this.errors.push('Senha incorreta');//adiciona erro
      this.user = null; //mantem usuário nulo
    }

    await this.Cargo(); //Verifica cargo e armazena

  }

  async Cargo() {
    await LoginModel.find({ email: this.body.email }) //encontra perfil com o email adicionado no login
      .then(user => {
        this.cargo = user[0].cargo
      })
  }

  async register() {
    this.valida();
    if (this.errors.length > 0) return; //observa erros antes de receber dados

    await this.userExists()

    if (this.errors.length > 0) return;  //observa erros depois de receber dados

    const salt = bcryptjs.genSaltSync();
    this.body.password = bcryptjs.hashSync(this.body.password, salt);  //criptografia a senha 

    this.user = await LoginModel.create(this.body);
  }
  async userExists() {
    this.user = await LoginModel.findOne({ email: this.body.email })
    if (this.user) this.errors.push('Usuário já existe');

  }

  valida() {
    this.cleanUp(); //
    //Validação 
    //Email válido
    if (!validator.isEmail(this.body.email)) this.errors.push('E-mail inválido');

    //Senha válida
    if (this.body.password.length < 3 || this.body.password.length >= 50) {
      this.errors.push('A senha precisa ter entre 3 e 50 caracteres')
    }

  }

  cleanUp() {
    for (const key in this.body) {
      if (typeof this.body[key] !== 'string') {
        this.body[key] = '';
      }
    }

    this.body = {
      email: this.body.email,
      password: this.body.password,
      cargo: this.body.cargo
    }
  }



}

module.exports = Login;