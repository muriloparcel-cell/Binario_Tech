const verificarContentTypeJson = (req, res, next) => {
  // Executa a verificação apenas para requisições POST
  if (req.method === 'POST') {
    const contentType = req.headers['content-type'];

    // O método req.is('json') verifica se o cabeçalho contém 'application/json'
    if (!contentType || !req.is('json')) {
      return res.status(400).json({
        erro: 'Bad Request',
        mensagem: 'O cabeçalho Content-Type deve ser application/json para requisições POST.'
      });
    }
  }

  return next();
};

module.exports = { verificarContentTypeJson };
