const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authController = {
  register: async (req, res) => {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ status: "ERRO", mensagem: "E-mail e senha são obrigatórios." });
      }

      if (senha.length < 6) {
        return res.status(400).json({
          status: "ERRO",
          mensagem: "A senha deve conter no mínimo 6 caracteres."
        });
      }

      // Verificação no Banco de Dados (Mongoose)
      const usuarioExiste = await Usuario.findOne({ email });
      if (usuarioExiste) {
        return res.status(400).json({ status: "ERRO", mensagem: "E-mail já cadastrado." });
      }

      // Criptografar a senha com bcryptjs (fator de custo / salt 10)
      const senhaHash = await bcrypt.hash(senha, 10);

      const novoUsuario = new Usuario({
        email,
        senha: senhaHash
      });

      await novoUsuario.save();

      return res.status(201).json({
        status: "SUCESSO",
        mensagem: "Usuário registrado com sucesso!",
        usuarioId: novoUsuario._id
      });
    } catch (erro) {
      console.error(erro);
      return res.status(500).json({ status: "ERRO", mensagem: "Erro ao registrar usuário." });
    }
  },

  login: async (req, res) => {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ status: "ERRO", mensagem: "E-mail e senha são obrigatórios." });
      }

      // Busca no Banco de Dados (Mongoose)
      const usuario = await Usuario.findOne({ email });
      if (!usuario) {
        return res.status(401).json({ status: "ERRO", mensagem: "Credenciais inválidas." });
      }

      // Validar a senha informada com o hash salvo no banco
      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      if (!senhaValida) {
        return res.status(401).json({ status: "ERRO", mensagem: "Credenciais inválidas." });
      }

      // Gerar o token JWT (expira em 30 minutos - Questão 2)
      const token = jwt.sign(
        { id: usuario._id, email: usuario.email },
        process.env.JWT_SECRET,
        { expiresIn: '30m' }
      );

      return res.status(200).json({ status: "AUTENTICADO", token });
    } catch (erro) {
      console.error(erro);
      return res.status(500).json({ status: "ERRO", mensagem: "Erro ao realizar login." });
    }
  },

  // QUESTÃO 3: Rota Protegida do Relatório
  relatorio: (req, res) => {
    return res.status(200).json({
      status: "SUCESSO",
      mensagem: "Acesso autorizado ao relatório confidencial!",
      dadosUsuarioLogado: req.usuario
    });
  }
};

module.exports = authController;
