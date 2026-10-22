const loggerMiddleware = (req, res, next) => {
  const start = Date.now();
  const { method, url } = req;

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[LOG] ${method} ${url} - Status: ${res.statusCode} (${duration}ms)`);
  });

  next();
};

module.exports = loggerMiddleware;

