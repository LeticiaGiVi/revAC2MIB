//requições
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

//configuração do express (server pra pagina e postman)
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());
const port = 3000;

//configuração do servidor mongodb
//conecte o mongodb
mongoose.connect('mongodb://127.0.0.1:27017/revac2mib', {
    useNewUrlParser : true,
    useUnifiedTopology : true,
    serverSelectionTimeoutMS : 20000  
})


//criando a model solicitada
const PessoaSchema = new mongoose.Schema({
  
   nome : {type : String},
   email : {type :String, required : true },
   endereco : {type : String},
   numero : {type : Number},
   cep : {type : String, required : true},
   nascimento : {type : Date, required : true}
});

const Pessoa = mongoose.model("Pessoa", PessoaSchema);

//roteamento padrão

app.post("/cadastropessoa", async(req, res)=>{
    const nome = req.body.nome;
    const email = req.body.email;
    const endereco = req.body.endereco;
    const numero = req.body.numero;
    const cep  = req.body.cep;
    const nascimento = req.body.nascimento

    if(nome == null || email == null || endereco == null || numero == null|| cep == null || nascimento == null){
        return res.status(400).json({error : "Preenchar todos os campos"});
    }

    const pessoa = new Pessoa({
        nome : nome,
        email : email,
        endereco : endereco,
        numero : numero,
        cep  : cep,
        nascimento : nascimento
    })

    try {
        const newPessoa = await pessoa.save();

        res.json({error : null, msg : "Cadastro feito com sucesso", pessoaId : newPessoa._id});
    }
    catch(error){
        res.status(400).json({error});
    }
});

app.get("/cadastropessoa", async(req, res)=>{
    res.sendFile(__dirname + "/cadastropessoa.html")
})

app.get("/", async(req, res)=>{
    res.sendFile(__dirname + "/index.html")
});


app.listen(port, ()=>{
    console.log(`servidor rodando na porta ${port}`)
})
