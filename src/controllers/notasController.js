const Notas = require('../models/NotasModel');

exports.register = async (req, res) => {

  try {
    const notas = new Notas(req.body);  //serve com middleware
    await notas.register();

    if (notas.errors.length > 0) {
      req.flash('errors', notas.errors);
      req.session.save(function () {
        return res.redirect('index');
      });
      return
    }

    req.flash('success', 'Notas registradas com sucesso');
    req.session.save(function () {
      return res.redirect('index');
    });
  } catch (e) {
    console.log(e);
    return res.render('404');
  }
}