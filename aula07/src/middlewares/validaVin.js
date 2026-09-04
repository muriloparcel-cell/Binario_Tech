const validaVin = (req, res, next) => {
  // Aceita tanto 'vin' quanto 'chassi' no body
  const vin = req.body.vin || req.body.chassi;

  if (!vin) {
    return res.status(400).json({
      erro: "Validação falhou",
      mensagem: "O campo 'vin' (ou 'chassi') é obrigatório."
    });
  }

  if (typeof vin !== "string") {
    return res.status(400).json({
      erro: "Validação falhou",
      mensagem: "O VIN/Chassi deve ser do tipo texto (string)."
    });
  }

  // Remove espaços extras nas pontas antes de checar o tamanho
  const vinFormatado = vin.trim();

  if (vinFormatado.length !== 12) {
    return res.status(400).json({
      erro: "Validação falhou",
      mensagem: `O VIN/Chassi deve possuir exatamente 12 caracteres. Recebido: ${vinFormatado.length} caracteres.`
    });
  }

  // Atribui o VIN formatado em caixa alta de volta ao body
  req.body.vin = vinFormatado.toUpperCase();

  next();
};

module.exports = validaVin;
