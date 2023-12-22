// app.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { engine } = require('express-handlebars')

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do mongoose
mongoose.connect('mongodb://localhost/meu-projeto', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;

// Configuração do express-handlebars
app.engine('handlebars', engine({defaultLayout: 'main', runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
    },
}),
),
app.set('view engine', 'handlebars')

// Configuração do body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// Model para os assuntos
const Assunto = mongoose.model('Assunto', {
  titulo: String,
  descricao: String,
  documentacoes: String,
  topicos: [{
    titulo: String,
    detalhamento: String,
  }],
});

// Rotas
app.get('/', async (req, res) => {
  const assuntos = await Assunto.find();
  res.render('index', { assuntos });
});

app.post('/adicionar-assunto', async (req, res) => {
  const { titulo, descricao, documentacoes, topicos } = req.body;
  const assunto = new Assunto({ titulo, descricao, documentacoes, topicos });
  await assunto.save();
  res.redirect('/');
});

// Configuração do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
