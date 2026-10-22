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

