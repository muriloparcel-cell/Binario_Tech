// middlewares/validaCnh.js
function validaCnhMiddleware(req, res, next) {
  const { cnh } = req.body;

  // 1. Verifica se a CNH foi informada no corpo da requisição
  if (!cnh) {
    return res.status(400).json({
      erro: "O campo 'cnh' é obrigatório."
    });
  }

  // Convertemos para String para garantir a validação caso seja enviado como número no JSON
  const cnhString = String(cnh).trim();

  // 2. Valida se contém exatamente 11 dígitos numéricos
  const cnhValida = /^\d{11}$/.test(cnhString);

  if (!cnhValida) {
    return res.status(400).json({
      erro: "CNH inválida. A CNH deve conter exatamente 11 dígitos numéricos."
    });
  }

  next();
}

module.exports = validaCnhMiddleware;
