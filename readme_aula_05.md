# Aula 05 - API REST, Middlewares e Testes de Segurança com Express

Este guia detalhado fornece o passo a passo completo, com o código de todos os arquivos, para implementar a API REST modular e executar os testes de auditoria de segurança exigidos na Aula 05.

## 1. Estrutura de Arquivos e Pastas

No terminal Linux (Debian), crie o diretório do projeto e as subpastas para módulos e middlewares:

```
mkdir aula05
cd aula05
mkdir middlewares routes

```

A estrutura final do projeto será a seguinte:

```
aula05/
├── middlewares/
│   ├── auth.js          # Middleware de autenticação (X-API-KEY)
│   ├── logger.js        # Middleware de log de requisições
│   └── validaCnh.js     # Middleware de validação de CNH
├── routes/
│   ├── manutencoes.js   # Roteador de manutenções
│   └── motoristas.js    # Roteador de motoristas
├── app.js               # Servidor principal Express
├── package.json         # Configurações do projeto Node.js
├── teste_seguranca.sh   # Script Bash para auditoria automatizada
└── audit_seguranca.log  # Log gerado automaticamente pelo script

```

## 2. Inicialização do Projeto e Dependências

Crie o arquivo package.json instalando os pacotes necessários (express e cors):

```
npm init -y
npm install express cors

```

O arquivo package.json ficará configurado assim:

```
{
  "name": "aula05",
  "version": "1.0.0",
  "description": "API REST com Express, Middlewares e Testes de Segurança",
  "main": "app.js",
  "scripts": {
    "start": "node app.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.19.2"
  }
}

```

## 3. Código-Fonte dos Arquivos

### middlewares/logger.js (Desafio 2)

Calcula e exibe no console o tempo de resposta, o método HTTP, a URL e o Status Code da requisição:

```
const loggerMiddleware = (req, res, next) => {
  const start = Date.now();
  const { method, url } = req;

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[LOG] ${method} ${url} - Status: ${res.statusCode} (${duration}ms)`);
  });

  next();
};

module.exports = loggerMiddleware;

```

### middlewares/auth.js (Desafio 2)

Valida o cabeçalho X-API-KEY. Requisições com chaves inválidas ou ausentes recebem HTTP 401 Unauthorized:

```
const authMiddleware = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const CHAVE_VALIDA = 'binario-tech-secret-2026';

  if (!apiKey || apiKey !== CHAVE_VALIDA) {
    return res.status(401).json({
      error: 'Não Autorizado',
      message: 'Chave de API inválida ou não fornecida no cabeçalho X-API-KEY.'
    });
  }

  next();
};

module.exports = authMiddleware;

```

### middlewares/validaCnh.js (Desafio 4)

Verifica se a CNH fornecida possui exatamente 11 dígitos numéricos:

```
const validaCnhMiddleware = (req, res, next) => {
  const { cnh } = req.body;

  if (!cnh || typeof cnh !== 'string' || !/^\d{11}$/.test(cnh)) {
    return res.status(400).json({
      error: 'Requisição Inválida',
      message: 'A CNH é obrigatória e deve conter exatamente 11 dígitos numéricos.'
    });
  }

  next();
};

module.exports = validaCnhMiddleware;

```

### routes/motoristas.js (Desafio 3 e 4)

Contém a listagem (GET /) e a criação (POST /) de motoristas, aplicando a validação de CNH na rota POST:

```
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

```

### routes/manutencoes.js (Desafio 3)

Contém a listagem (GET /) e a criação (POST /) de manutenções:

```
const express = require('express');
const router = express.Router();

// Simulador de banco de dados
const manutencoes = [
  { id: 1, veiculo: 'Volvo FH 540', descricao: 'Troca de óleo e filtros', status: 'Concluída' }
];

// GET /api/v1/manutencoes
router.get('/', (req, res) => {
  res.status(200).json({
    sucesso: true,
    dados: manutencoes
  });
});

// POST /api/v1/manutencoes
router.post('/', (req, res) => {
  const { veiculo, descricao } = req.body;

  if (!veiculo || !descricao) {
    return res.status(400).json({
      error: 'Requisição Inválida',
      message: 'Os campos "veiculo" e "descricao" são obrigatórios.'
    });
  }

  const novaManutencao = {
    id: manutencoes.length + 1,
    veiculo,
    descricao,
    status: 'Pendente'
  };

  manutencoes.push(novaManutencao);

  res.status(201).json({
    sucesso: true,
    mensagem: 'Manutenção agendada com sucesso!',
    dados: novaManutencao
  });
});

module.exports = router;

```

### app.js (Desafio 1, 2 e 3)

Ponto de entrada do servidor. Configura CORS, middleware de log, rota pública de health check, autenticação e rotas modularizadas:

```
const express = require('express');
const cors = require('cors');

// Importação de Middlewares
const loggerMiddleware = require('./middlewares/logger');
const authMiddleware = require('./middlewares/auth');

// Importação de Roteadores
const motoristasRoutes = require('./routes/motoristas');
const manutencoesRoutes = require('./routes/manutencoes');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurações Globais
app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

// Rota Pública: Health Check (Desafio 1)
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
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

```

### teste_seguranca.sh (Desafio 5)

Script Bash para automatizar os testes. O direcionamento para `audit_seguranca.log` e para o terminal (usando `tee`) é feito internamente pelo próprio script:

```
#!/bin/bash

LOG_FILE="audit_seguranca.log"

# Redireciona stdout e stderr para o log e exibe no terminal ao mesmo tempo
exec > >(tee -a "$LOG_FILE") 2>&1

API_URL="http://localhost:3000/api/v1"
API_KEY="binario-tech-secret-2026"

echo "=========================================="
echo "    INICIANDO AUDITORIA DE SEGURANÇA      "
echo "=========================================="
echo ""

echo "--- 1. Teste Health Check (200 OK - Público) ---"
curl -i -s "${API_URL}/health"
echo -e "\n\n"

echo "--- 2. Teste Sem Autenticação (401 Unauthorized) ---"
curl -i -s "${API_URL}/motoristas"
echo -e "\n\n"

echo "--- 3. Teste Com Chave Inválida (401 Unauthorized) ---"
curl -i -s -H "X-API-KEY: chave-incorreta" "${API_URL}/motoristas"
echo -e "\n\n"

echo "--- 4. Teste Validação de CNH Inválida (400 Bad Request) ---"
curl -i -s -X POST "${API_URL}/motoristas" \
  -H "X-API-KEY: ${API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"nome": "Carlos Teste", "cnh": "12345"}'
echo -e "\n\n"

echo "--- 5. Teste Cadastro Bem-sucedido (201 Created) ---"
curl -i -s -X POST "${API_URL}/motoristas" \
  -H "X-API-KEY: ${API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"nome": "Maria Oliveira", "cnh": "98765432100"}'
echo -e "\n\n"

echo "--- 6. Teste Consulta Autenticada (200 OK) ---"
curl -i -s -H "X-API-KEY: ${API_KEY}" "${API_URL}/motoristas"
echo -e "\n\n"

echo "--- 7. Teste Rota Inexistente (404 Not Found) ---"
curl -i -s -H "X-API-KEY: ${API_KEY}" "${API_URL}/rota-inexistente"
echo -e "\n\n"

echo "=========================================="
echo "         AUDITORIA CONCLUÍDA              "
echo "=========================================="

```

## 4. Executando os Testes (Desafio 5)

1. Em um terminal, inicie o servidor Express:

   ```
   node app.js
   
   ```

2. Em outro terminal, dê permissão de execução ao script:

   ```
   chmod +x teste_seguranca.sh
   
   ```

3. Execute o script diretamente. O próprio script criará e preencherá o arquivo `audit_seguranca.log`:

   ```
   ./teste_seguranca.sh
   
   ```

## 5. Encerramento de Processo e Git Push (Desafio 6)

### Encerrando o Servidor Node:

Para localizar o PID do processo Node.js em execução:

```
ps aux | grep node

```

Encerre o processo referente ao `app.js` informando o PID localizado:

```
kill -9 <PID>

```

### Versionamento e Submissão para o GitHub:

Adicione os arquivos ao Git e envie para o repositório remoto:

```
git init
git add .
git commit -m "feat: conclusao de todos os desafios da aula 05"
git branch -M main
git remote add origin <URL_DO_REPOSITORIO_GITHUB>
git push -u origin main

```