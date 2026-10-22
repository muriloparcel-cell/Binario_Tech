const express = require('express');
const cors = require('cors');

// Importação de Middlewares
const loggerMiddleware = require('./middlewares/logger');
const authMiddleware = require('./middlewares/auth');

// Importação de Roteadores
const motoristasRoutes = require('./routes/motoristas');
const manutencoesRoutes = require('./routes/manutencoes');

const app = express();
const PORT = process.env.PORT || 3028;

// Configurações Globais
app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

// Rota Pública: Health Check (Desafio 1)
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    aplicacao: 'Binario Tech API v2',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Rotas Protegidas por Autenticação (Desafio 2 e 3)
app.use('/api/v1/motoristas', authMiddleware, motoristasRoutes);
app.use('/api/v1/manutencoes', authMiddleware, manutencoesRoutes);

// Tratamento de Rota Não Encontrada - 404 (Desafio 5)
app.use((req, res) => {
  res.status(404).json({
    error: 'Não Encontrado',
    message: 'A rota solicitada não existe nesta API.'
  });
});

// Inicialização do Servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

