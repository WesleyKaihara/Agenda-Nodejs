const Vendas = require('../models/VendasModel');

exports.register = async (req, res) => {

  try {
    const vendas = new Vendas(req.body);  //serve com middleware
    await vendas.register();

    if (vendas.errors.length > 0) {
      req.flash('errors', vendas.errors);
      req.session.save(function () {
        return res.redirect('index');
      });
      return
    }

    req.flash('success', 'Venda/Serviço registrado com sucesso');
    req.session.save(function () {
      return res.redirect('/Portal');
    });
  } catch (e) {
    console.log(e);
    return res.render('404');
  }
}

exports.getVendas = async (req, res) => {
  const vendas = new Vendas();
  const registros = await vendas.getVendas();
  res.render('vendas', { registros });
}

exports.delete = async function (req, res) {
  if (!req.params.id) return res.render('404');
  const vendas = new Vendas(req.params.id);
  const registro = await vendas.delete(req.params.id);
  if (!registro) return res.render('404');
  req.flash('success', 'Venda/Serviço deletado com sucesso');
  req.session.save(() => res.redirect('/Vendas'));
  return;
}

exports.editIndex = async (req, res) => {
  if (!req.params.id) return res.render('404');
  const vendas = new Vendas(req.params.id);
  const venda = await vendas.buscaPorId(req.params.id);
  if (!venda) return res.render('404');

  res.render('vendasEdit', { venda });
}

exports.edit = async function (req, res) {
  try {
    if (!req.params.id) return res.render('404');
    const vendas = new Vendas(req.body);
    await vendas.edit(req.params.id);

    if (vendas.errors.length > 0) {
      req.flash('errors', vendas.errors);
      req.session.save(() => res.redirect(`/editarvenda/${req.params.id}`));
      return;
    }
    req.flash('success', 'Venda/Serviço editado com sucesso');
    req.session.save(() => res.redirect(`/Vendas`));
    return;
  } catch (e) {
    console.log(e)
    res.render('404')
  }
}