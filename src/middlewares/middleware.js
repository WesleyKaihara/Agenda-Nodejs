exports.middlewareGlobal = (req, res, next) => {
  res.locals.umaVariavelLocal = 'Valor da variável local'
  next();
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