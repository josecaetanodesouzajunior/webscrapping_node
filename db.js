const mongoose = require('mongoose')
require("./app")

const TramiteSchema = mongoose.Schema({

    projeto:{
        type:String
    }, 
    entrada:{
        type:String
    },
    prazo:{
        type:String
    }, 
    devolucao:{
        type:String
    }

})

const ProjetosSchema = mongoose.Schema({

    titulo:{
        type: String,        
    },
    data:{
     type: String
    },
    situacao:{
        type: String
    },
    autor:{
       type: String
    },
    ementa:{
        type:String
    },
    tramite:[TramiteSchema]
      
})

mongoose.model("projetos",ProjetosSchema);
mongoose.model("tramites",TramiteSchema);