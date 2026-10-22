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

