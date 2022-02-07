//Intermediadores

exports.middlewareGlobal = (req, res, next) => {  //Envia valores para todas as rotas  e arquivos
  res.locals.errors = req.flash('errors'); //Erros
  res.locals.success = req.flash('success');  //Sucesso
  res.locals.alerts = req.flash('alerts');//Alertas
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
    req.session.save(() => res.redirect('/login/index'));
    return
  }
  next();
}


exports.isAdmin = async (req, res, next) => {//Verifica cargo do usuário 
  if (!req.session.user) {//não possui session.user intao não possui ninguem logado
    req.flash('errors', 'Você precisa fazer login');
    req.session.save(() => res.redirect('/login/index'));
    return
  }
  if (req.session.user.cargo !== 'Admin') { //Cargo diferente de Admin (Alunos e Professores), está antes pois maioria estara aqui aumentando a velocidade no sistema
    req.flash('errors', 'Você não tem a permissão de admin');
    req.session.save(() => res.redirect('/login/index'));
    return
  }
  if (req.session.user.cargo === 'Admin') {
    req.flash('success', 'Você pode ver os dados do alunos');
    next()
  }


}

