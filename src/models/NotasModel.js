const mongoose = require('mongoose');//Controla dados do MongoDB - banco de dados
const validator = require('validator');//Biblioteca para validação de dados - ex: email
const bcryptjs = require('bcryptjs');//criptografia de senha


const NotasSchema = new mongoose.Schema({    //tratar dados - tudo requerido
  email: { type: String, required: true },
  portugues: { type: Number, required: false, default: 0 },
  matematica: { type: Number, required: false, default: 0 },
  biologia: { type: Number, required: false, default: 0 },
  fisica: { type: Number, required: false, default: 0 },
  quimica: { type: Number, required: false, default: 0 },
  artes: { type: Number, required: false, default: 0 },
  edfisica: { type: Number, required: false, default: 0 },
  ingles: { type: Number, required: false, default: 0 },
  filosofia: { type: Number, required: false, default: 0 },
  geografia: { type: Number, required: false, default: 0 },
  historia: { type: Number, required: false, default: 0 },
  sociologia: { type: Number, required: false, default: 0 },
});
const NotasModel = mongoose.model('Notas', NotasSchema); //table no banco de dados

class Notas {
  constructor(body) {   //recebe dados dos inputs
    this.body = body;
    this.errors = []; //erros começam vazios 
    this.nota = null; //sem usuário inicialmente
    this.alerts = []
  }

  async register() {
    this.valida();
    if (this.errors.length > 0) return; //observa erros antes de receber dados

    this.notas = await NotasModel.findOne({ email: this.body.email })
    if (this.errors.length > 0) return; //observa erros antes de receber dados

    if (!this.notas) {
      this.errors.push('Aluno não cadastrado ou email incorreto');
      if (this.errors.length > 0) return; //observa erros antes de receber dados
    } else {
      this.notas = await NotasModel.findByIdAndUpdate(this.notas._id, this.body, { new: true });//Porcura coluna com valor da id e recebe novo valor do body 
    }

  }

  valida() {
    this.cleanUp(); //
    //Validação 
    //Email válido
    if (!validator.isEmail(this.body.email)) this.errors.push('E-mail inválido');

    //Campos vazios
    const materias = [this.body.portugues, this.body.matematica, this.body.biologia, this.body.fisica, this.body.quimica, this.body.artes, this.body.edfisica, this.body.ingles, this.body.filosofia, this.body.geografia, this.body.historia, this.body.sociologia]

    const validaNotas = materias.forEach(materia => {
      if (materia < 0 || materia > 100) {
        this.errors.push('Algumas notas foram lançadas incorretamente');
        console.log('Menor que 0 ou maior que 100')
        if (this.errors.length > 0) return; //observa erros antes de receber dados
      }
    })

  }

  cleanUp() {
    for (const key in this.body) {
      if (typeof this.body[key] !== 'string') {
        this.body[key] = '';
      }
    }

    this.body = {
      email: this.body.email,
      portugues: this.body.portugues,
      matematica: this.body.matematica,
      biologia: this.body.biologia,
      fisica: this.body.fisica,
      quimica: this.body.quimica,
      artes: this.body.artes,
      edfisica: this.body.edfisica,
      ingles: this.body.ingles,
      filosofia: this.body.filosofia,
      geografia: this.body.geografia,
      historia: this.body.historia,
      sociologia: this.body.sociologia,
    }
  }

}

module.exports = Notas;