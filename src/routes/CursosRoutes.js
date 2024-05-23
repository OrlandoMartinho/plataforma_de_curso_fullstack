const express = require('express');
const router = express.Router();
const cursosController = require('../controllers/CursosControllers');


// Rota para cadastrar um curso
router.post('/cadastrar', cursosController.cadastrarCurso);
// Rota para listar todos cursos
router.post('/listar', cursosController.obterTodosCursos);
//Rota para obter um curso
router.post('/obter_um',cursosController.obterUmCursoPorId)

router.post('/mais_assistidos',cursosController.obterCursosMaisAssistidos)

router.post('/pesquisar',cursosController.pesquisarCurso)

router.post('/adicionar_curso_assinado',cursosController.cadastrarCursoAssinado)

router.post('/listar_curso_assinado',cursosController.obterTodosCursosAssinados)

router.delete('/',cursosController.eliminarCurso)

module.exports = router;
