// routes/manutencoes.js
const express = require('express');
const router = express.Router();

// Base de dados em memória para simulação
const manutencoes = [
  {
    id: 1,
    caminhaoId: 'ABC-1234',
    descricao: 'Troca de óleo e filtros',
    valorOrcamento: 1500.00,
    status: 'Pendente',
    dataCriacao: new Date()
  }
];

// GET /manutencoes - Listar todas as manutenções
router.get('/', (req, res) => {
  return res.status(200).json({
    sucesso: true,
    total: manutencoes.length,
    dados: manutencoes
  });
});

// POST /manutencoes - Cadastrar um novo orçamento de manutenção
router.post('/', (req, res) => {
  const { caminhaoId, descricao, valorOrcamento } = req.body;

  // Validação simples dos dados de entrada
  if (!caminhaoId || !descricao || !valorOrcamento) {
    return res.status(400).json({
      erro: 'Campos obrigatórios ausentes. Informe caminhaoId, descricao e valorOrcamento.'
    });
  }

  const novaManutencao = {
    id: manutencoes.length + 1,
    caminhaoId,
    descricao,
    valorOrcamento: Number(valorOrcamento),
    status: 'Pendente',
    dataCriacao: new Date()
  };

  manutencoes.push(novaManutencao);

  return res.status(201).json({
    sucesso: true,
    mensagem: 'Orçamento de manutenção cadastrado com sucesso!',
    dados: novaManutencao
  });
});

module.exports = router;
