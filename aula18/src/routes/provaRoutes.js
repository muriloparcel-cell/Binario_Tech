const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validarJWT = require('../middlewares/validarJWT'); // Ou autenticarToken, conforme salvou o arquivo

// Rotas públicas (Questão 1 e Questão 2)
router.post('/register', authController.register);
router.post('/login', authController.login);

// Rota protegida (Questão 3: GET /api/v1/prova/relatorio)
router.get('/relatorio', validarJWT, authController.relatorio);

module.exports = router;
