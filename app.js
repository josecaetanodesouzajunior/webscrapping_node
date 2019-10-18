const express = require("express")
const handlebars = require("express-handlebars")
const bodyparser = require("body-parser")
const mongoose = require("mongoose")
const path = require("path")
const admin = require("./routes/admin")
const app = express();
const db = require("./config")


//configuracões
  //body-parser
    app.use(bodyparser.urlencoded({extended:true}))
    app.use(bodyparser.json())

   //handlebars
   app.engine('handlebars',handlebars({defaultLayout:'main'})) 
   app.set("view engine", "handlebars")

   //mongoose

   mongoose.Promise= global.Promise;

  mongoose.connect(db.mongo_URI).then(() =>{
 console.log("Conectado com sucesso no mongo!");
}).catch((err)=>{
    console.log("Erro ao conectar ao mongo! "+err);
})

   //public
   app.use(express.static(path.join(__dirname,'public')))

//rotas
app.use('/admin',admin);

//outros

const PORT= process.env.PORT || 8081;

app.listen(PORT, ()=>{

    console.log("servidor rodando!")
})