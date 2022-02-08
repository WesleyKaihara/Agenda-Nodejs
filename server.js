require('dotenv').config();  //dotenv - armazenar valores sensíveis - não são enviados para github
const express = require('express');//Framework para nodejs auxilia na criação de aplicações BackEndde , requisições HTTP.Usado por PayPal, IBM, Uber,etc;
const app = express();
const mongoose = require("mongoose"); //Conecta sistema com banco de dados MongoDB

mongoose.connect(process.env.CONECTIONSTRING)  //Recebe URL do mongoDB , do arquvio .env - Privado
  .then(() => {   // then = então
    app.emit('pronto')
  })
  .catch(e => console.log(e));  //pega erros se existir

const session = require('express-session'); //O middleware armazena os dados da sessão no servidor; ele salva apenas o ID da sessão no cookie, não os dados da sessão.
const MongoStore = require('connect-mongo');//Criar conexão com banco de dados, configurar
const flash = require('connect-flash');//O flash é uma área especial da sessão usada para armazenar mensagens. As mensagens são gravadas no flash e apagadas após serem exibidas ao usuário.


const routes = require('./routes');  //Recebe as Rotas GET,POST,UPDATE,DELETE
const path = require('path');  //receber caminho absoluto
const helmet = require('helmet'); //Auxilia na segurança no Sistema ,protegendo contra alguns tipos de ataques como clickjacking
const csrf = require('csurf');//Gera um token cada vez que a página é carregada e verifica de acordo com o secret

const { middlewareGlobal, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware');
//Middlewares de Segurança
//MiddlewareGlobal - Passa dados para todas as Rotas


//        Criar    Ler    Atualizar Apagar
//CRUD => Create , Read , Update ,  delete
//        POST     GET    PUT       DELETE

app.use(helmet());

app.use(
  express.urlencoded(
    {
      extended: true  //permite o aninhamento de objetos (nested objects)
    }
  ));



app.use(express.static(path.resolve(__dirname, 'public'))); //conteudo estatico
app.set('views', path.resolve(__dirname, 'src', 'views')); //Define a Rota de Views

const sessionOptions = session({  //Configura o sistema 
  secret: "sfafsfnaufn131fnnf",
  store: new MongoStore({
    mongoUrl: process.env.CONECTIONSTRING  //URL mongoDB - Banco de dados
  }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,   //guarda por 1 semana
    httpOnly: true
  }
});

app.use(sessionOptions);
app.use(flash());
app.set('view engine', 'ejs');  //engine dos views - html , ejs , etc

app.use(csrf());

//Middlewares pessoais
app.use(middlewareGlobal);
app.use(checkCsrfError);
app.use(csrfMiddleware);
app.use(routes);

app.on('pronto', () => {   //Inicia Servidor Local
  app.listen(3000, () => {   //porta 3000
    console.log('Acessar http://localhost:3000')
    console.log('Servidor sendo executado na porta 3000')
  });
});


