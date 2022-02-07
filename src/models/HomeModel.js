const mongoose = require('mongoose');//Controla dados do MongoDB - banco de dados

const HomeSchema = new mongoose.Schema({    //tratar dados
  titulo: { type: String, required: true },
  descricao: String
});

const HomeModel = mongoose.model('Home', HomeSchema);

module.exports = HomeModel;