// Simulação de banco de dados em memória
let frotaMercedes = [
  {
    id: 1,
    modelo: "Actros",
    versao: "2653 6x4",
    ano: 2024,
    capacidadeCargaTons: 26.0,
    status: "Disponível"
  },
  {
    id: 2,
    modelo: "Atego",
    versao: "1719 4x2",
    ano: 2023,
    capacidadeCargaTons: 17.0,
    status: "Em manutenção"
  }
];

// Listar todos os caminhões (com opção de filtrar por modelo: Actros ou Atego)
const listarCaminhoes = (req, res) => {
  const { modelo } = req.query;

  if (modelo) {
    const filtrados = frotaMercedes.filter(
      (c) => c.modelo.toLowerCase() === modelo.toLowerCase()
    );
    return res.status(200).json(filtrados);
  }

  return res.status(200).json(frotaMercedes);
};

// Buscar caminhão por ID
const buscarPorId = (req, res) => {
  const { id } = req.params;
  const caminhao = frotaMercedes.find((c) => c.id === parseInt(id));

  if (!caminhao) {
    return res.status(404).json({ mensagem: "Caminhão não encontrado na frota." });
  }

  return res.status(200).json(caminhao);
};

// Adicionar um novo caminhão à frota
const criarCaminhao = (req, res) => {
  const { modelo, versao, ano, capacidadeCargaTons, status } = req.body;

  // Validação dos modelos aceitos
  const modelosValidos = ["Actros", "Atego"];
  if (!modelo || !modelosValidos.includes(modelo)) {
    return res.status(400).json({
      mensagem: "Modelo inválido. Informe 'Actros' ou 'Atego'."
    });
  }

  const novoCaminhao = {
    id: frotaMercedes.length > 0 ? frotaMercedes[frotaMercedes.length - 1].id + 1 : 1,
    modelo,
    versao,
    ano,
    capacidadeCargaTons,
    status: status || "Disponível"
  };

  frotaMercedes.push(novoCaminhao);
  return res.status(201).json(novoCaminhao);
};

// Atualizar dados de um caminhão
const atualizarCaminhao = (req, res) => {
  const { id } = req.params;
  const { modelo, versao, ano, capacidadeCargaTons, status } = req.body;

  const index = frotaMercedes.findIndex((c) => c.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ mensagem: "Caminhão não encontrado." });
  }

  if (modelo && !["Actros", "Atego"].includes(modelo)) {
    return res.status(400).json({
      mensagem: "Modelo inválido. Informe 'Actros' ou 'Atego'."
    });
  }

  frotaMercedes[index] = {
    ...frotaMercedes[index],
    ...(modelo && { modelo }),
    ...(versao && { versao }),
    ...(ano && { ano }),
    ...(capacidadeCargaTons && { capacidadeCargaTons }),
    ...(status && { status })
  };

  return res.status(200).json(frotaMercedes[index]);
};

// Remover caminhão da frota
const deletarCaminhao = (req, res) => {
  const { id } = req.params;
  const index = frotaMercedes.findIndex((c) => c.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ mensagem: "Caminhão não encontrado." });
  }

  frotaMercedes.splice(index, 1);
  return res.status(200).json({ mensagem: "Caminhão removido da frota com sucesso." });
};

module.exports = {
  listarCaminhoes,
  buscarPorId,
  criarCaminhao,
  atualizarCaminhao,
  deletarCaminhao
};
