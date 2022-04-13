const Login = require('../models/LoginModel');

exports.index = (req, res) => {
  return res.render('login')
}

exports.portal = (req, res) => {
  if (req.session.user.cargo === 'Aluno') {
    return res.render('aluno', { session: req.session })
  }
  else if (req.session.user.cargo === 'User') {
    return res.render('CadastrarVendas', { session: req.session })
  }
  else if (req.session.user.cargo === 'Admin') {
    return res.render('admin', { session: req.session })
  }
  else {
    return res.render('404')
  }
}

exports.indexRegister = (req, res) => {
  return res.render('register')
}

exports.register = async (req, res) => {
  try {
    const login = new Login(req.body);  //serve com middleware
    await login.register();

    if (login.errors.length > 0) {
      req.flash('errors', login.errors);
      req.session.save(function () {
        return res.redirect('/Portal');
      });
      return
    }
    req.flash('success', 'Seu usário foi criado com sucesso');
    req.session.save(function () {
      return res.redirect('/Portal');
    });
  } catch (e) {
    console.log(e);
    return res.render('404');
  }
}


exports.login = async (req, res) => {
  try {
    const login = new Login(req.body);  //serve com middleware
    await login.login();

    if (login.errors.length > 0) {
      req.flash('errors', login.errors);
      req.session.save(function () {
        return res.redirect('index');
      });
      return;
    }

    req.flash('success', 'Você entrou no sistema');

    req.session.user = login.user;
    req.session.save(function () {
      if (req.session.user.cargo === 'Aluno') {
        return res.render('aluno', { session: req.session })
      }
      else if (req.session.user.cargo === 'User') {
        res.redirect('/Vendas');
      }
      else if (req.session.user.cargo === 'Admin') {
        return res.render('admin', { session: req.session })
      }
      else {
        return res.render('404')
      }

    })
  } catch (e) {
    console.log(e)
  }
}

exports.logout = function (req, res) {
  req.session.destroy();
  res.redirect('/')
}
