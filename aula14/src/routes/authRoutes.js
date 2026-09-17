const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const autenticarToken = require('../middlewares/autenticarToken');
const autorizarPerfil = require('../middlewares/autorizarPerfil');

// Rotas públicas
router.post('/register', authController.registrar);
router.post('/login', authController.login);

// Rota privada (exige Token JWT)
router.get('/perfil', autenticarToken, authController.perfil);

router.get('/admin/dashboard', autenticarToken, autorizarPerfil(['ADMIN']), (req, res) => {
  res.json({ mensagem: 'Acesso concedido ao painel administrativo!' });
});

module.exports = router;
