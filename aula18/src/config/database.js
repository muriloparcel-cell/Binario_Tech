const mongoose = require('mongoose');

const conectarBanco = async () => {
  try {
	  const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error('A variável MONGO_URI não foi encontrada no process.env. Verifique o arquivo .env.');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB conectado com sucesso!');
  } catch (erro) {
    console.error('Erro ao conectar ao MongoDB:', erro);
    process.exit(1);
  }
};

module.exports = conectarBanco;
