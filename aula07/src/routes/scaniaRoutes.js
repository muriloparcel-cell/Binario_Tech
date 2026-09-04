const express = require('express');
const router = express.Router();
const scaniaController = require('../controllers/scaniaController');
const validaVin = require("../middlewares/validaVin");

router.get('/', scaniaController.listarTelemetria);
router.post('/', validaVin, scaniaController.registrarTelemetria);
router.post('/caminhoes', validaVin, scaniaController.criarCaminhao);

module.exports = router;
