require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3028;

app.use(express.json());

// Rota de Diagnostico do Container
app.get ('/api/v1/container/info', (req, res) => {
	res.json({
		status: "OPERACIONAL",
		ambiente: process.env.NODE_ENV || "desenvolvimento",
		modulo: "Binario Tech - Conteinerização Docker",
		hostname: require('os').hostname(),
		portaInterna: PORT,
		timestamp: new Date()
	});
});

app.listen (PORT, () => {
	console.log(`[Binario Tech] Microserciço rodando no container na porta ${PORT}`);
});
