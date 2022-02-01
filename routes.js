const express = require('express');  //Framework para nodejs auxilia na criação de aplicações BackEndde , requisições HTTP.Usado por PayPal, IBM, Uber,etc;
const route = express.Router();
const homeController = require('./src/controllers/homeController') //importa a Página Inicial 
const loginController = require('./src/controllers/loginController') //importa a parte funcional do sistema,controle de erros, verificação e recebimento de dados da página de LOGIN.
const contatoController = require('./src/controllers/contatoController')//importa a parte funcional do sistema,controle de erros, verificação e recebimento de dados da página de CONTATO.

const { loginRequired } = require('./src/middlewares/middleware')  // Middleware- Funciona como intermediario para verificar usário esta logado

//Rotas da Home
route.get('/', homeController.index);  // Rota para acessar a página Principal do Sistema, onde são apresentados os contatos.


//Rotas de login   
//Metodo      //Rota           //Controller - Parte funcional 
route.get('/login/index', loginController.index);  //Rota onde há um formulário para realiazação de um cadastro ou login
route.post('/login/register', loginController.register); //Rota POST , utilizada quando enviado o formulário de Cadastro de USUÁRIOS
route.post('/login/login', loginController.login); //Rota POST, utilizado para realizar login
route.get('/login/logout', loginController.logout);//Rota usada para finalizar session , assim realizando o logout

//Rotas de contato
//Metodo      //Rotas      //Login necessário      //Controller - Parte Funcional
route.get('/contato/index', loginRequired, contatoController.index);  //Rota onde é apresentado formulário para criação de contatos na agenda
route.post('/contato/register', loginRequired, contatoController.register); //Rota POST , utilizada para enviar o formulário de cadastro de CONTATOS
route.get('/contato/index/:id', loginRequired, contatoController.editIndex); //Rota apresenta os valores do contato após sua criação, para um possivel atualização de dados
route.post('/contato/edit/:id', loginRequired, contatoController.edit); //Rota para atualizar contatos no banco de dados


module.exports = route;  //exporta todas os dados de controle de rotas 
