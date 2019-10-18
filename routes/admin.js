const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../db")

const Projeto = mongoose.model("projetos")


router.get('/',(req,res) =>{

    Projeto.find().then((projetos)=>{

     
        res.render("admin/index", {projetos: projetos})

    }).catch((err)=>{
        console.log("error_msg","houve um erro ao listar os projetos!" +err)
    })
    
    
})


module.exports = router

