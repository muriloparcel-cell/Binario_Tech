const mongoose = require('mongoose');

const conectarBanco = async () => {
	try {
		const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/binario_tech_nosql';
		await mongoose.connect(uri);
		console.log('[Binario Tech] Conexão NoSQL ativa!');
	} catch (erro) {
		process.exit(1);
	}
};

module.exports = conectarBanco;
