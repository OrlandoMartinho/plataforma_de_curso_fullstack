const multer = require('multer');
const path = require('path');
const fs=require('fs')
const token = require('../utils/token');
const db=require('../config/dbConfig');
const notify=require('../controllers/NotificacoesController')
const finalistasController=require('../controllers/FinalistasController')

const cursosControllers ={

    cadastrarCurso:async (req,res)=>{
        finalistasController.addFinalista
        const {accessToken,nome_do_formador,titulo,categoria,modo,descricao,modulo}=req.body

        if(!accessToken||!nome_do_formador||!titulo||!categoria||!modo||!descricao||!modulo){
            return res.status(400).json({Mensagem:"Campos incompletos"})
        }

        if(! await token.verificarTokenUsuario(accessToken)||token.usuarioId(accessToken)!=1){
            return res.status(401).json({Mensagem:"Token inválido"})
        }

        const insertQuery ='INSERT INTO cursos (nome_do_formador,titulo,categoria,modo,descricao,modulo) VALUES (?,?,?,?,?,?)'

        db.query(insertQuery,[nome_do_formador,titulo,categoria,modo,descricao,modulo],(err, results)=>{

            if(err){
                console.log("Erro:"+err.message)
                return res.status(500).json({Mensagem:"Erro interno do servidor"})
            }
                       
            const uploadDirectory = path.join(__dirname,"..","..","uploads","cursos",results.insertId+'');
            console.log(uploadDirectory)
            if (!fs.existsSync(uploadDirectory)){
                fs.mkdirSync(uploadDirectory);
            }
            notify.addNotificacao("Um novo curso foi cadastrado",0,"Novo Curso")
            return res.status(201).json({Mensagem:"Curso cadastrado com sucesso",id_curso:results.insertId})

        })
        
    },
    obterUmCursoPorId:async(req,res)=>{
        finalistasController.addFinalista()
        const { accessToken ,id_curso} = req.body;

        if(!accessToken||!id_curso){
            return res.status(400).json({Mensagem:"Campos incompletos"})
        }

        if(!await token.verificarTokenUsuario(accessToken)){
            return res.status(401).json({Mensagem:"Token invalido"})
        }
        let modo
        if(token.usuarioAssinado(accessToken)!=2){
            modo = 'gratuito'
        }

        const select_query_cursos = 'SELECT * FROM cursos WHERE id_curso = ? '
        const select_query_video  = 'SELECT * FROM videos WHERE id_curso = ?'

        db.query(select_query_cursos, [id_curso],(err,result)=>{

            if(err){
                console.log("Erro:"+err.message)
                return res.status(500).json({Mensagem:"Erro interno do servidor"})
            }

            if(result[0].modo=='pago' && modo=='gratuito'){
                return res.status(401).json("Seja um assinante para obter este curso")
            }

            db.query(select_query_video,[id_curso],(errr,results)=>{
               
               if(errr){
                 console.log("Erro:"+errr.message)
                 return res.status(500).json({Mensagem:"Erro interno do servidor"})
               }

               return res.status(200).json({curso:result[0],videos:results})

            })

        })
    },
    obterTodosCursos:async (req,res)=>{
        finalistasController.addFinalista
      const { accessToken } = req.body;

        if(!accessToken){
            return res.status(400).json({Mensagem:"Campos incompletos"})
        }

        if(!await token.verificarTokenUsuario(accessToken)){
            return res.status(401).json({Mensagem:"Token invalido"})
        }   

        const select_query_cursos = 'SELECT * FROM cursos '

        db.query(select_query_cursos, (err, results) => {
        
            if(err){
                console.log("Erro:"+err.message)
                return results.status(500).json({Mensagem:"Erro interno do servidor"})
            }

            return res.status(200).json({cursos:results})
        
        })

    }
    ,
    obterCursosMaisAssistidos: async (req, res) => {
        const { accessToken } = req.body;
    
        if (!accessToken) {
            return res.status(400).json({ Mensagem: "Campos incompletos" });
        }
    
        if (!(await token.verificarTokenUsuario(accessToken))) {
            return res.status(401).json({ Mensagem: "Token inválido" });
        }
    
        const query = `
            SELECT cursos.id_curso, cursos.titulo, COUNT(videos_assistidos.id_curso) AS total_assistidos
            FROM cursos
            LEFT JOIN videos_assistidos ON cursos.id_curso = videos_assistidos.id_curso
            GROUP BY cursos.id_curso
            ORDER BY total_assistidos DESC
        `;
    
        db.query(query, (err, results) => {
            if (err) {
                console.log("Erro: " + err.message);
                return res.status(500).json({ Mensagem: "Erro interno do servidor" });
            }
            return res.status(200).json({ cursos: results });
        });
    } ,
    pesquisarCurso: async (req, res) => {
        finalistasController.addFinalista();
        const { accessToken, pesquisa } = req.body;
    
        if (!accessToken || !pesquisa) {
            return res.status(400).json({ Mensagem: "Campos incompletos" });
        }
    
        if (!await token.verificarTokenUsuario(accessToken)) {
            return res.status(401).json({ Mensagem: "Token inválido" });
        }
    
        const select_query_cursos = `
            SELECT * FROM cursos 
            WHERE titulo LIKE ? OR descricao LIKE ? OR modulo LIKE ? OR modo LIKE ? OR categoria LIKE ?`;

        db.query(select_query_cursos,  [`%${pesquisa}%`, `%${pesquisa}%`, `%${pesquisa}%`, `%${pesquisa}%`, `%${pesquisa}%`], (err, results) => {
            if (err) {
                console.log("Erro: " + err.message);
                return res.status(500).json({ Mensagem: "Erro interno do servidor" });
            }
    
            return res.status(200).json({ cursos: results });
        });
    },
    cadastrarCursoAssinado:async (req,res)=>{
        finalistasController.addFinalista
        const {accessToken,id_curso,id_usuario}=req.body

        if(!accessToken||!id_curso||!id_usuario){
            return res.status(400).json({Mensagem:"Campos incompletos"})
        }

        if(! await token.verificarTokenUsuario(accessToken)||token.usuarioId(accessToken)!=1){
            return res.status(401).json({Mensagem:"Token inválido"})
        }

        const insertQuery ='INSERT INTO cursos_assinados (id_usuario,id_curso) VALUES (?,?)'
        const selectQuery='SELECT * FROM cursos_assinados WHERE id_usuario = ? AND id_curso = ?'

        db.query(selectQuery,[id_usuario,id_curso],(erro,resultado)=>{
            if(erro){
                console.log("Erro:",erro.message)
                return res.status(500).json({mensagem:"erro internodo servidor"})
            }

            if(resultado.length>0){
                return res.status(403).json({mensagem:"curso já adicionado"})
            }
            
        db.query(insertQuery,[id_usuario,id_curso],(err, results)=>{

            if(err){
                console.log("Erro:"+err.message)
                return res.status(500).json({Mensagem:"Erro interno do servidor"})
            }
                       
          
            notify.addNotificacao("A sua assinatura foi aprovada",0,"Assinatura aprovada")
            return res.status(201).json({Mensagem:"Curso cadastrado com sucesso",id_curso:results.insertId})

        })

        })


        
    },
    obterTodosCursosAssinados: async (req, res) => {
        const { accessToken } = req.body;
      
        if (!accessToken) {
          return res.status(400).json({ Mensagem: "Campos incompletos" });
        }
      
        if (!(await token.verificarTokenUsuario(accessToken))) {
          return res.status(401).json({ Mensagem: "Token inválido" });
        }
      
        const select_query_cursos_assinados =
          "SELECT * FROM cursos_assinados WHERE id_usuario = ?";
        const select_query_cursos = "SELECT * FROM cursos WHERE id_curso = ?";
      
        db.query(
          select_query_cursos_assinados,
          [token.usuarioId(accessToken)],
          (err, result) => {
            if (err) {
              console.log("Erro:" + err.message);
              return res.status(500).json({ Mensagem: "Erro interno do servidor" });
            }
      
            let cursos = [];
            let count = 0;
      
            if (result.length === 0) {
              return res.status(200).json({ cursos: cursos });
            }
      
            for (let i = 0; i < result.length; i++) {
              db.query(select_query_cursos, [result[i].id_curso], (errr, results) => {
                if (errr) {
                  console.log("Erro:", errr.message);
                  return res
                    .status(500)
                    .json({ mensagem: "Erro interno do servidor" });
                }
      
                cursos.push(results[0]);
      
                count++;
      
                if (count === result.length) {
                  return res.status(200).json({ cursos: cursos });
                }
              });
            }
          }
        );
      },
    obterUmCursoAssinadoPorId:async(req,res)=>{
        finalistasController.addFinalista()
        const { accessToken ,id_curso_assinado} = req.body;

        if(!accessToken||!id_curso_assinado){
            return res.status(400).json({Mensagem:"Campos incompletos"})
        }

        if(!await token.verificarTokenUsuario(accessToken)){
            return res.status(401).json({Mensagem:"Token invalido"})
        }
        
        const select_query_cursos = 'SELECT * FROM cursos WHERE id_curso = ?'
        const select_query_video  = 'SELECT * FROM videos WHERE id_curso = ?'
        const select_query_cursos_assinados='SELECT * FROM cursos_assinados WHERE id_curso_assinado = ? AND id_usuario = ?'

        db.query(select_query_cursos_assinados, [id_curso_assinado,token.usuarioId(accessToken)],(err,result)=>{

            if(err){
                console.log("Erro:"+err.message)
                return res.status(500).json({Mensagem:"Erro interno do servidor"})
            }

            if(result.length===0){
                return res.status(404).json({mensagem:"Curso não encontrado"})
            }
            db.query(select_query_cursos,[result[0].id_curso],(errr,results)=>{
               
                if(errr){
                  console.log("Erro:"+errr.message)
                  return res.status(500).json({Mensagem:"Erro interno do servidor"})
                }

                db.query(select_query_video,[result[0].id_curso],(errr,results)=>{
               
                    if(errr){
                      console.log("Erro:"+errr.message)
                      return res.status(500).json({Mensagem:"Erro interno do servidor"})
                    }
     
                    return res.status(200).json({curso:result,videos:results})
     
                })
 
            })
        })
    }
    

}

module.exports = cursosControllers