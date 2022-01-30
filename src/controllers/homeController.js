//.find apresenta dados do banco
// HomeModel.create({      //.create criar arquivo no bando
//   titulo: "Um titulo de teste",
//   descricao: "Outra descrição de teste"
// }).then(dados => console.log(dados))
//   .catch(e => console.log(e));

exports.index = (req, res) => {
  res.render('index')
}

