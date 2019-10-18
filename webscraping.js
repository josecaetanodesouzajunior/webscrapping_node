const rp = require('request-promise')
const cheerio = require('cheerio')
const mongoose = require('mongoose')
require("./app")

const Projeto = mongoose.model("projetos")

var numero = 0;

var project = new Object();
var tramite = new Object();


var lista=[];
var listaDeProjetos=[];
var tramites = [];



// caminho para pegar o numero de paginação
function buscarListaDeProjetos() {
    
    const optionsPaginas = {
        uri:'http://www.legislador.com.br/LegisladorWEB.ASP?WCI=ProjetoConsulta&ID=20&inProjTramitado=1&dsVerbete=TRANSPORTE&inEOU=0',
        encoding: 'latin1',
        headers: {
            'Connection': 'keep-alive',
            'Accept-Encoding': '',
            'Accept-Language': 'en-US,en;q=0.8'
        },
        transform: function (body) {
            return cheerio.load(body)
          }
        
        }
         
        rp(optionsPaginas)
        .then(($) => {
           
            $('.form-inline').each((i, item) =>{
             numero = ($(item).find('input[type=hidden][name=ttPaginas]').val());        
             console.log($(item).find('input[type=hidden][name=ttPaginas]').val());
              
            })      
          
          
        }).then(()=>{
          
              // laço para percorrer as páginas de resultados se houver paginação
              for ( paginaAtual = 0; paginaAtual < numero; paginaAtual++) {    
                var options = {
                    method: 'POST',
                    uri: 'http://www.legislador.com.br/LegisladorWEB.ASP?WCI=ProjetoConsulta',
                    encoding: 'latin1',
                    headers: {
                        'Connection': 'keep-alive',
                        'Accept-Encoding': '',
                        'Accept-Language': 'en-US,en;q=0.8'
                    },
                    form: {
                        ID: 20,
                        pgAtual:paginaAtual,
                        ttPaginas: numero,
                        Navegar:'>',
                        inEspecie:0,
                        inOrigem:0,
                        inProjTramitado:1,
                        ordernarPor:0,
                        dsVerbete:'TRANSPORTE'
                    },
                    transform: function (body) {
                      return cheerio.load(body)
                    }
                  }
                
                  rp(options)
                  .then(($) => {
                      $('.col-lg-6 .card .card-header').each((i, item) =>{
                        console.log($(item).find('.card-title').text());
                        var tituloInteiro = $(item).find('.card-title').text();
                        var somenteNumeros = tituloInteiro.substring(tituloInteiro.indexOf(")")+1);
             
                        var numeroProjeto = somenteNumeros.substring(0,somenteNumeros.indexOf("/"));
                        var anoProjeto = somenteNumeros.substring(somenteNumeros.indexOf("/")+1)
                        console.log("titulo Tratado: "+somenteNumeros);
                        console.log("Somente numero projeto: "+numeroProjeto);
                        console.log("somente ano projeto: "+anoProjeto);
    
                        if (numeroProjeto !== null && anoProjeto !==null) {
                            project.numero=numeroProjeto;
                            project.ano=anoProjeto;
                            lista.push(project);
                            project = new Object();

                            buscarDetalhesProjeto(numeroProjeto,anoProjeto);
                        }                                                     
                                              
             
                      })
                    
                  })         
            }
          
        })
        .catch((err) => {
          console.log(err);
         
        })

      
      
}




function buscarDetalhesProjeto(numero,ano) {

    console.log("entrou no metodo!!!");
 

      const optionsDetalhes = {
        uri:'http://www.legislador.com.br/LegisladorWEB.ASP?WCI=ProjetoTexto&ID=20&INEspecie=1&nrProjeto='+numero+'&aaProjeto='+ano,
        encoding: 'latin1',
        headers: {
            'Connection': 'keep-alive',
            'Accept-Encoding': '',
            'Accept-Language': 'en-US,en;q=0.8'
        },
        transform: function (body) {
            return cheerio.load(body)
          }
        
        }
         
        rp(optionsDetalhes)
        .then(($) => {
         
          
          var itemTitulo= $('.card-title')[0];
          var itemEmenta=$('.card-body .card-text')[0]
          var titulo =$(itemTitulo).text();
          var ementa = $(itemEmenta).text();

          var item1 = $( '.col-sm-9' )[ 0 ];
          var item2 = $( '.col-sm-9' )[ 1 ];         
          var item4 = $( '.col-sm-9' )[ 4 ];

          

       

          $('#idTramite > table > tbody > tr').each((i,item)=>{
            
         tramite.projeto =  $(item).find('td:nth-child(1)').text();
         tramite.entrada = $(item).find('td:nth-child(2)').text();
         tramite.prazo =  $(item).find('td:nth-child(3)').text();
         tramite.devolucao =  $(item).find('td:nth-child(4)').text();
         tramites.push(tramite);
         tramite = new Object();
         console.log(tramites);
          })
             
            $('.card-body .row .col-lg .row').each((i, item) =>{
                var situacao = $(item).find(item1).text();
                var data = $(item).find(item2).text();
                var autor = $(item).find(item4).text();
           

            if (situacao!=='') {
               
                project.titulo=titulo;
                project.data =data;
                project.situacao = situacao;
                project.ementa=ementa;
                project.autor = autor;
                project.tramite=tramites;

                tramites = [];
                var NovoProjeto = mongoose.model('projetos');
                

                new NovoProjeto({

                    titulo:project.titulo,
                    data:project.data,
                    situacao:project.situacao,
                    ementa:project.ementa,
                    autor:project.autor,
                    tramite:project.tramite

                }).save().then(()=>{

                    console.log("Cadastrado no banco com sucesso!");
                }).catch((err)=>{
                    console.log("Erro ao cadastrar no banco "+err);
                })

                listaDeProjetos.push(project);
                project = new Object();
                console.log(listaDeProjetos);
            }

           
              
          })              
          
        })
        .catch((err) => {
          console.log(err);
         
        })
    }
      
 

  
  buscarListaDeProjetos();
  

  

   
 


