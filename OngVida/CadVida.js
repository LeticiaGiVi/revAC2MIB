//requisitando os modulos
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");

//configurando o express para o postman e para usar a pagina
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const port = 3000;

//configurando o banco de dados
mongoose.connect("mongodb://127.0.0.1:27017/dbvida", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//criando a model do seu projeto
const UsuarioSchema = new mongoose.Schema({
  nome: { type: String },
  email: { type: String, required: true },
  endereco: { type: String },
  numero: { type: Number },
  cep: { type: String, required: true },
  nascimento: { type: Date, required: true },
});

const Usuario = mongoose.model("Usuario", UsuarioSchema);

//configuração dos roteamendos
//cadastrousuario
app.post("/cadastrousuario", async (req, res) => {
  const nome = req.body.nome;
  const email = req.body.email;
  const endereco = req.body.endereco;
  const numero = req.body.numero;
  const cep = req.body.cep;
  const nascimento = req.body.nascimento;


  //validação de campos
  if(nome == null || email == null || endereco == null || numero == null || cep == null || nascimento == null){
    return res.status(400).json({error : "Preenchar todos os campos!!!"});
  }

  //teste de duplicidade
  const emailExiste = await Usuario.findOne({email : email});

  if(emailExiste){
    return res.status(400).json({error : "O email informado já existe"});
  }

  
  const usuario = new Usuario({
    nome: nome,
    email: email,
    endereco: endereco,
    numero: numero,
    cep: cep,
    nascimento: nascimento
  });

  try {
    const newUsuario = await usuario.save();
    res.json({ error: null, msg: "Cadastro ok", UsuarioId: newUsuario._id });
  } catch (error) {}
});

//rota de get de formulario
app.get("/cadastrousuario", async (req, res) => {
  res.sendFile(__dirname + "/cadastrousuario.html");
});

app.get("/", async (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});