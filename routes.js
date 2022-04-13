const express = require('express');  //Framework para nodejs auxilia na criação de aplicações BackEndde , requisições HTTP.Usado por PayPal, IBM, Uber,etc;
const route = express.Router();
const loginController = require('./src/controllers/loginController') //importa a parte funcional do sistema,controle de erros, verificação e recebimento de dados da página de LOGIN.
const homeController = require('./src/controllers/homeController')//importa a parte funcional do sistema,controle de erros, verificação e recebimento de dados da página de ALUNO.
const vendasController = require('./src/controllers/vendasController')//importa a parte funcional do sistema,controle de erros, verificação e recebimento de dados da página de ALUNO.

const { loginRequired, isAdmin } = require('./src/middlewares/middleware')  // Middleware- Funciona como intermediario para verificar usário esta logado

//Rotas da Home
route.get('/', homeController.index);  // Rota para acessar a página Principal do Sistema, onde são apresentados os contatos.


//Rotas de login   
//Metodo      //Rota           //Controller - Parte funcional 
route.get('/login', loginController.index);  //Rota onde há um formulário para realiazação de um cadastro ou login
route.get('/register', loginController.indexRegister)
route.post('/login/register', loginController.register); //Rota POST , utilizada quando enviado o formulário de Cadastro de USUÁRIOS
route.post('/services', loginController.login); //Rota POST, utilizado para realizar login
route.get('/login/logout', loginController.logout);//Rota usada para finalizar session , assim realizando o logout

route.get('/Portal', loginRequired, loginController.portal)//Verifica se usuário está logado , em seguida verifica seu cargo

//Rotas de Vendas
route.post('/cadastroVendas', loginRequired, vendasController.register);
route.get('/Vendas', loginRequired, vendasController.getVendas);
route.get('/deletarVenda/:id', loginRequired, vendasController.delete);
route.get('/editarvenda/:id', loginRequired, vendasController.editIndex);
route.post('/atualizarvenda/:id', loginRequired, vendasController.edit)
module.exports = route;  //exporta todas os dados de controle de rotas 
