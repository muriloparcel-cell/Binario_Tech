const express = require('express');
const router = express.Router();
const validaCnh = require('../middlewares/validaCnh');

// Simulador de banco de dados
const motoristas = [
  { id: 1, nome: 'Carlos Silva', cnh: '12345678901' }
];

// GET /api/v1/motoristas
router.get('/', (req, res) => {
  res.status(200).json({
    sucesso: true,
    dados: motoristas
  });
});

// POST /api/v1/motoristas
router.post('/', validaCnh, (req, res) => {
  const { nome, cnh } = req.body;

  if (!nome) {
    return res.status(400).json({
      error: 'Requisição Inválida',
      message: 'O campo "nome" é obrigatório.'
    });
  }

  const novoMotorista = {
    id: motoristas.length + 1,
    nome,
    cnh
  };

  motoristas.push(novoMotorista);

  res.status(201).json({
    sucesso: true,
    mensagem: 'Motorista cadastrado com sucesso!',
    dados: novoMotorista
  });
});

module.exports = router;

