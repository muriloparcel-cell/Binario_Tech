const express = require("express");
const router = express.Router();
const mercedesController = require("../controllers/mercedesController");
const validaVin = require("../middlewares/validaVin");

// Rotas da Frota Mercedes-Benz
router.get("/caminhoes", mercedesController.listarCaminhoes);
router.get("/caminhoes/:id", mercedesController.buscarPorId);
router.post("/caminhoes", mercedesController.criarCaminhao);
router.put("/caminhoes/:id", mercedesController.atualizarCaminhao);
router.delete("/caminhoes/:id", mercedesController.deletarCaminhao);
router.post("/caminhoes", validaVin, mercedesController.criarCaminhao);

module.exports = router;
