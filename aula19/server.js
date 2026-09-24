require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3228;

app.use(express.json());

// Rota de Status do Serviço
app.get('/api/v1/telemetria/status', (req, res) => {
	res.json({
		servico: "Serviço de Telemetria Binario Tech",
		status: "OPERACIONAL",
		uptime: process.uptime(),
		pid: process.pid,
		timestamp: new Date()
	});
});

// Rota para Simular Falha Critica / Crash de Aplicação
app.get('/api/v1/telemetria/crash', (req, res) => {
	console.error(`[ALERTA] Falha critica simulada pelo PID ${process.pid}`);
	res.status(500).json({ mensagem: "Simulando falha grave no processo!" });
	setTimeout(() => {
		process.exit(1); // Encerra o processo Node forçadamente
	}, 1000);
});

app.listen(PORT, () => {
	console.log(`[Binario Tech] Microserviço ativo na porta ${PORT} (PID: ${process.pid})`);
});
