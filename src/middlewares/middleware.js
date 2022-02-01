//Intermediadores

exports.middlewareGlobal = (req, res, next) => {  //Envia valores para todas as rotas  e arquivos
  res.locals.errors = req.flash('errors'); //Erros
  res.locals.success = req.flash('success');  //Sucesso
  res.locals.user = req.session.user; //Usário 
  next(); // vai para proxima função
}

exports.checkCsrfError = (err, req, res, next) => {
  if (err) {
    return res.render('404'); //página de erro
  };

  next();
};

exports.csrfMiddleware = (req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next()
}

exports.loginRequired = (req, res, next) => {  //Verifica se Usuário esta logado
  if (!req.session.user) {
    req.flash('errors', 'Você precisa fazer login');
    req.session.save(() => res.redirect('/'));
    return
  }
  next();
}