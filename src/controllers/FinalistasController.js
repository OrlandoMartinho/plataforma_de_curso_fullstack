const db = require('../config/dbConfig');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secretKey = require('../private/secretKey.json');
const token = require('../utils/token');
const validarEmail = require('../utils/verificarEmail')
const gerarCodigoDeVerificacao=require('../utils/gerarcodigoDeVerificacao')
const enviarEmail = require('../utils/enviarEmail')
const multer=require('multer')
const path=require('path')
const saltRounds = 10;
const fs=require('fs');
const salt = bcrypt.genSaltSync(saltRounds);
const notify = require('../controllers/NotificacoesController');
const data_assinatura=require('../utils/converterData')

const upload = multer({
    limits: { fileSize: 1 * 1024 * 1024 }, // Define o limite de tamanho do arquivo para 1MB
    fileFilter: (req, file, cb) => {
        // Verifica se o tipo de arquivo é aceito
        if (!file.originalname.match(/\.(png|jpg|jpeg|pdf)$/)) {
            return cb(new Error('Tipo de arquivo inválido'));
        }
        cb(null, true);
    }
}).single('file');

const finalistasController = {
    
    addFinalista:async()=>{
 
        const selectQueryVideosAssistidos='SELECT * FROM videos_assistidos WHERE id_usuario=?';
        const selectQueryVideos='SELECT * FROM videos WHERE id_curso = ?';
        const selectQueryCursos ='SELECT * FROM cursos';
        const selectQueryUsuarios='SELECT * FROM usuarios';
        const insertQueryFinalista='INSERT INTO finalistas(nome,id_usuario,id_curso) VALUES (?,?,?)';
    
        db.query(selectQueryCursos,(err,results)=>{
            if(err){
                console.log("Erro:"+err.message);
                return;
            }
            if(results.length!=0){
                const cursos =results;
    
                for (let i = 0; i < cursos.length; i++) {
                   
                    db.query(selectQueryVideos,[cursos[i].id],(errr,resultss)=>{
                        if(errr){
                            console.log("Erro:"+errr.message);
                            return;
                        }
                    
                        if(resultss.length!=0){
                            const videos=resultss;
                            db.query(selectQueryUsuarios,(errrr,resultsss)=>{
                                if(errrr){
                                    console.log("Erro:",errrr.message);
                                    return;
                                }
    
                                if(resultsss.length!=0){
                                    const usuarios=resultsss;
                                    for (let y = 0; y < usuarios.length; y++) {
    
                                        db.query(selectQueryVideosAssistidos,[usuarios[y].id],(errrrr,resultssss)=>{
                                            if(errrrr){
                                                console.log("Erro:"+errrrr.message);
                                                return;
                                            }
                                        
                                            if(resultssss.length!=0){
                                                const videos_assistidos=resultssss;
                                                if(videos_assistidos.length==videos.length){
                                                    
                                                    const selectFinalistas='SELECT * FROM finalistas WHERE id_usuario=? AND id_curso=?';
                                                    db.query(selectFinalistas,[usuarios[y].id, cursos[i].id],(erro,resultado)=>{
                                                        if(erro){
                                                            console.log("Erro:",erro.message);
                                                            return;
                                                        }
    
                                                        if(resultado.length==0){
                                                            db.query(insertQueryFinalista,[usuarios[y].nome,usuarios[y].id,cursos[i].id],(errrrrr,resultsssss)=>{
    
                                                                if(errrrrr){
                                                                    console.log("Erro:",errrrrr.message);
                                                                    return;                                                       
                                                                }
                                                                const titulo="Finalista";
                                                                const notificacao ="O usuário "+usuarios[y].nome+" acabou de finalizar o curso "+cursos[i].titulo+". Código do curso: "+cursos[i].id;
                                                                console.log("Novo finalista adicionado com sucesso");
                                                                notify.addNotificacao(notificacao,1,titulo);
                                                            
                                                            });
                                                        }
                                                    });  
                                                }
                                            } 
                                       });
    
                                    }
                                }
                               
                            });
                        }
                       
                    });
                }
            }
            console.log("Finalistas verificados");
            return;
        });
    }
    ,
    cadastrarCertificado:async(req,res)=>{

        try {
            upload(req, res, async function(err) {
                if (err) {
                    console.error('Erro ao fazer upload do arquivo:', err);
                    return res.status(500).send('Erro ao enviar arquivo, verifica o tamanho');
                }
               
             
                const {accessToken,id_usuario} = req.body;
                const arquivo = req.file 
                // Verificar se todos os campos obrigatórios estão presentes
                if (!id_finalista||!accessToken) {
                   return res.status(400).json({ Mensagem: "Campos incompletos" });
                }
       
               const tokenValido = await token.verificarTokenUsuario(accessToken);
               if (!tokenValido||token.usuarioId(accessToken)!=1) {
                   return res.status(401).json({ mensagem: 'Token inválido' });
               }
                // Verifica a extensão do arquivo
                const extensao = path.extname(arquivo.originalname).toLowerCase();
                console.log(extensao)
                if (!['.png', '.jpg', '.jpeg', '.pdf'].includes(extensao)) {
                    return res.status(400).json({ mensagem: 'Formato de arquivo inválido. Apenas arquivos PNG, JPG, JPEG, PDF, TXT, MP3, WAV, M4A, DOC e DOCX são permitidos' });
                }
                fs.writeFileSync(`./uploads/certificados/${arquivo.originalname}`, arquivo.buffer);
                const updateQuery = 'INSERT INTO certificados  (id_usuario,nome_arquivo)values(?,?)';
                db.query(updateQuery,[id_usuario,arquivo.originalname.toLowerCase()],(err,result)=>{
                
                   if(err){
                     console.log("Erro:"+err)
                     return res.status(500).json({ Mensagem: "Erro interno do servidor" });
                   }

                   const selectQuery= 'SELECT id_usuario FROM finalistas WHERE id_usuario = ?'

                   db.query(selectQuery,[id_usuario],(errr,results)=>{

                    if(errr){
                        console.log("Erro:"+errr.message)
                        return res.status(500).json({Mensagem:"Erro interno do servidor"})
                    }

                   const notificacao = "Voce recebeu um novo certificado";
                   const titulo ="Certificado" 
                   notify.addNotificacao(notificacao,results[0].id_usuario,titulo);
                   return res.status(201).json({ Mensagem: "Certificado cadastrado com sucesso"}); 

                   })


                          
                                     
            });   
        })
        } catch (error) {
            console.error('Erro ao Enviar Arquivo:');
           return res.status(500).json({ mensagem: 'Erro ao Arquivo verifique o tamanho e a extensão:' });
        }
         
    },
    obterTodosCertificados:async(req,res)=>{
       
        const {accessToken} = req.body

       if(!accessToken){
          return res.status(400).json({Mensagem:"Dados inválidos"})
       }

       if(! await token.verificarTokenUsuario(accessToken)||token.usuarioId(accessToken)==1){
          return res.status(401).json({Mensagem:"Token inválido"})
       }

        const selectQuery='SELECT * FROM certificados WHERE id_usuario = ?'

        db.query(selectQuery,[token.usuarioId(accessToken)],async (err, result) => {

            if(err){
                console.log("Erro:"+err.message)
                return res.status(500).json({Mensagem:"Erro interno do servidor"})
            }           
                return res.status(200).json({certificados:result})
            })

    },
    retornarCertificado: async (req, res)=> {
      try {
        const { accessToken,nomeDoArquivo } = req.body;

        if (!accessToken || !nomeDoArquivo) {
            return res.status(400).json({ Mensagem: "Campos incompletos" });
        }

        if (!(await token.verificarTokenUsuario(accessToken)) || token.usuarioId(accessToken) != 1) {
            return res.status(401).json({ mensagem: 'Token inválido' });
        }

        // Verifica se o arquivo existe
        const caminhoArquivo = path.join(__dirname, '..', '..', 'uploads', 'certificados', nomeDoArquivo);
        if (!fs.existsSync(caminhoArquivo)) {
            return res.status(404).json({ mensagem: 'Arquivo não encontrado' });
        }

        // Define o cabeçalho da resposta para indicar que é um arquivo PDF (ou outro tipo de arquivo conforme necessário)
        res.setHeader('Content-Type', 'application/pdf');

        // Define o cabeçalho de Content-Disposition para indicar que é um anexo para download
        res.setHeader('Content-Disposition', `attachment; filename=${nomeDoArquivo}`);

        // Lê o arquivo e envia como resposta
        fs.createReadStream(caminhoArquivo).pipe(res);
    } catch (error) {
        console.error('Erro ao retornar arquivo:', error.message);
        res.status(500).json({ mensagem: 'Erro interno do servidor ao retornar arquivo' });
    }
    
    },
    obterTodosFinalistas:async(req,res)=>{
       
        const {accessToken} = req.body

       if(!accessToken){
          return res.status(400).json({Mensagem:"Dados inválidos"})
       }

       if(! await token.verificarTokenUsuario(accessToken)||token.usuarioId(accessToken)!=1){
          return res.status(401).json({Mensagem:"Token inválido"})
       }

        const selectQuery='SELECT * FROM finalistas'

        db.query(selectQuery,async (err, result) => {

            if(err){
                console.log("Erro:"+err.message)
                return res.status(500).json({Mensagem:"Erro interno do servidor"})
            }           
                return res.status(200).json({finalistas:result})
            })

    }
}

module.exports = finalistasController;
