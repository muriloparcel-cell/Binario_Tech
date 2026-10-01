require('dotenv').config();
const express = require('express');
const cors = require('cors');
const conectarDB = require('./src/config/database'); 	
const provaRoutes = require('./src/routes/provaRoutes');

const app = express();
const PORT = process.env.PORT || 3028;

app.use(cors());
app.use(express.json());

conectarDB();

app.use('/api/v1/prova', provaRoutes);

app.listen(PORT, () => {
  console.log(`[Binário Tech] Servidor de Autenticação JWT Aula 18 ativo na porta ${PORT}`);
});
