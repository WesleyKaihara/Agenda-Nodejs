const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const LoginSchema = new mongoose.Schema({    //tratar dados
  email: { type: String, required: true },
  password: { type: String, required: true },
  cargo: { type: String, required: true }
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = null;
    this.cargo = undefined;
  }

  async login() {
    this.valida();

    if (this.errors.lenth > 0) return;

    this.user = await LoginModel.findOne({ email: this.body.email });  //verifica se usuario ja existe

    if (!this.user) {
      this.errors.push('Usuário não existe');
      return;
    }

    if (!bcryptjs.compareSync(this.body.password, this.user.password)) {
      this.errors.push('Senha incorreta');
      this.user = null;
    }

    await this.Cargo();

  }

  async Cargo() {
    await LoginModel.find({ email: this.body.email })
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

    // if (this.body.cargo == undefined) {
    //   this.errors.push('Selecione um Cargo')
    // }

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