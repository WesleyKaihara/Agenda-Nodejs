const mongoose = require('mongoose');//Controla dados do MongoDB - banco de dados
const validator = require('validator');//Biblioteca para validação de dados - ex: email
const bcryptjs = require('bcryptjs');//criptografia de senha


const VendasSchema = new mongoose.Schema({    //tratar dados - tudo requerido
  nome: { type: String, required: true },
  valor: { type: Number, required: false, default: 0 },
  description: { type: String, required: true },
  diaVenda: { type: String, required: true }
});
const VendasModel = mongoose.model('Vendas', VendasSchema); //table no banco de dados

class Vendas {
  constructor(body) {   //recebe dados dos inputs
    this.body = body;
    this.venda = null;
    this.errors = []; //erros começam vazios 
  }

  async register() {
    this.valida();
    if (this.errors.length > 0) return; //observa erros antes de receber dados

    this.venda = await VendasModel.create(this.body);
  }

  valida() {
    this.cleanUp(); //
    //Validação 
    if (this.body.description.length < 5) {
      this.errors.push('Descrição deve ter no minimo 10 caracteres');
      console.log('Descrição deve ter no minimo 10 caracteres');
    }
  }

  async delete(id) {   //função estática
    if (typeof id !== 'string') return;
    const vendas = await VendasModel.findOneAndDelete({ _id: id })
    return vendas;
  }

  async getVendas() {   //função estática , apresenta colunas de vendas
    const vendas = await VendasModel.find().sort();
    return vendas;
  }

  async buscaPorId(id) {   //função estática 
    if (typeof id !== 'string') return;
    const venda = await VendasModel.findById(id);
    return venda;
  }

  async edit(id) {  //Update de dados
    if (typeof id !== 'string') return;
    // this.valida();
    // // if (this.errors.length > 0) return; //Verifica erros
    return await VendasModel.findByIdAndUpdate(id, this.body, { new: true });//Porcura coluna com valor da id e recebe novo valor do body
  }

  cleanUp() {
    for (const key in this.body) {
      if (typeof this.body[key] !== 'string') {
        this.body[key] = '';
      }
    }

    this.body = {
      nome: this.body.nome,
      valor: this.body.valor,
      description: this.body.description,
      diaVenda: new Date().toLocaleDateString(),
    }
  }
}

module.exports = Vendas;