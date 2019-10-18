if (process.env.NODE_ENV=="production") {
    module.exports={mongo_URI:"mongodb+srv://rooot:1234@cluster0-2gls3.mongodb.net/test?retryWrites=true&w=majority"}
}else{

    module.exports={mongo_URI:"mongodb://localhost/buscador2"}

}