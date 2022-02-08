const Aluno = require('../models/AlunoModel');

exports.index = (req, res) => {
  res.render('alunoRegister', {
    aluno: {}
  })
}

exports.register = async (req, res) => {
  try {
    const aluno = new Aluno(req.body);
    await aluno.register();

    if (aluno.errors.length > 0) {
      req.flash('errors', aluno.errors);
      req.session.save(() => res.redirect('index'));
      return;
    }

    req.flash('success', 'Aluno registrado com sucesso');
    req.session.save(() => res.redirect(`/contato/index/${aluno.aluno._id}`));
    return;
  } catch (e) {
    console.log(e)
    return res.render('404')
  }

}

exports.editIndex = async (req, res) => {
  if (!req.params.id) return res.render('404');

  const aluno = await Aluno.buscaPorId(req.params.id);
  if (!aluno) return res.render('404');

  res.render('alunoEdit', { aluno });
}

exports.edit = async function (req, res) {
  try {
    if (!req.params.id) return res.render('404');
    const aluno = new Aluno(req.body);
    await aluno.edit(req.params.id);

    if (aluno.errors.length > 0) {
      req.flash('errors', aluno.errors);
      req.session.save(() => res.redirect(`/contato/index/${req.params.id}`));
      return;
    }

    req.flash('success', 'Aluno editado com sucesso');
    req.session.save(() => res.redirect(`/contato/index/${aluno.aluno._id}`));
    return;

  } catch (e) {
    console.log(e)
    res.render('404')
  }

}

exports.delete = async function (req, res) {
  if (!req.params.id) return res.render('404');
  const aluno = await Aluno.delete(req.params.id);
  if (!aluno) return res.render('404');
  req.flash('success', 'Aluno apagado com sucesso');
  req.session.save(() => res.redirect(`back`));
  return;

}