function tratarErros(err, req, res, next) {
	console.error(`{ERRO LOG}: ${err.message}`);

	if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
		return res.status(400).json({ erro: "Sintaxe di JSON invalida. Verifique a formatação do corpo da requisição." });
	}

	if (err.message && err.message.includes('UNIQUE constraint failed')) {
		return res.status(409).json({ erro: "Conflito de dados: Registro ja existe com este valor unico (ex: Placa)." });
	}

	if (err.message && err.message.includes('FOREIGN KEY constraint failed')) {
		return res.status(400).json({ erro: "Erro de relacionamento: O registro pai fornecido não existe." });
	}

	return res.status(500).json({ erro: "Erro interno no servidor da Binario Tech." });
}

module.exports = tratarErros;
