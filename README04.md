# [Binário Tech] API de Gestão de Frotas (Aula 04)

Este repositório contém a implementação prática da **Aula 04**, construindo uma API RESTful completa em Node.js utilizando o framework **Express** para gerenciamento de frotas de veículos. O ambiente recomendado para execução é o **Google Cloud Shell**.

---

## 🛠️ Tecnologias Utilizadas
- **Node.js**
- **Express.js** (Framework web)
- **cURL / jq** (Ferramentas de linha de comando para requisições HTTP e formatação JSON)

---

## 🚀 Guia Passo a Passo

### [PASSO 1] Preparação do Ambiente
Execute os comandos abaixo no seu terminal para criar a estrutura da pasta e instalar as dependências:

```bash
cd ~/binario_tech
mkdir -p aula04
cd aula04
npm init -y
npm install express
```

### [PASSO 2] Criação do Servidor (`frota_api.js`)
O servidor simula um banco de dados em memória contendo operações completas de CRUD (Create, Read, Update, Delete). O código completo da aplicação é o seguinte:

```javascript
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// Banco de dados em memoria
let veiculos = [
    { id: 1, placa: "ABC-1234", montadora: "Scania", modelo: "R450", status: "DISPONIVEL" },
    { id: 2, placa: "XYZ-9876", montadora: "Mercedes-Benz", modelo: "Actros", status: "EM_ROTA" }
];

// 1. GET /api/v1/veiculos - Listar todos os veiculos (Suporta filtro por status query param)
app.get('/api/v1/veiculos', (req, res) => {
    const { status } = req.query;
    if (status) {
        const filtrados = veiculos.filter(v => v.status.toUpperCase() === status.toUpperCase());
        return res.status(200).json(filtrados);
    }
    res.status(200).json(veiculos);
});

// 2. GET /api/v1/veiculos/:id - Buscar veiculo por ID
app.get('/api/v1/veiculos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const veiculo = veiculos.find(v => v.id === id);
    if (!veiculo) {
        return res.status(404).json({ erro: "Veiculo nao encontrado na base de dados." });
    }
    res.status(200).json(veiculo);
});

// 3. POST /api/v1/veiculos - Cadastrar novo veiculo (Criacao)
app.post('/api/v1/veiculos', (req, res) => {
    const { placa, montadora, modelo } = req.body;
    if (!placa || !montadora || !modelo) {
        return res.status(400).json({ erro: "Campos 'placa', 'montadora' e 'modelo' sao obrigatorios." });
    }
    const novoVeiculo = {
        id: veiculos.length + 1,
        placa,
        montadora,
        modelo,
        status: "DISPONIVEL"
    };
    veiculos.push(novoVeiculo);
    res.status(201).json(novoVeiculo);
});

// 4. PATCH /api/v1/veiculos/:id/status - Atualizar status do veiculo
app.patch('/api/v1/veiculos/:id/status', (req, res) => {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    const veiculo = veiculos.find(v => v.id === id);
    
    if (!veiculo) {
        return res.status(404).json({ erro: "Veiculo nao encontrado." });
    }
    if (!status) {
        return res.status(400).json({ erro: "O campo 'status' e obrigatorio." });
    }

    veiculo.status = status.toUpperCase();
    res.status(200).json({ mensagem: "Status atualizado com sucesso!", veiculo });
});

// 5. DELETE /api/v1/veiculos/:id - Remover veiculo da frota
app.delete('/api/v1/veiculos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = veiculos.findIndex(v => v.id === id);
    if (index === -1) {
        return res.status(404).json({ erro: "Veiculo nao encontrado." });
    }
    veiculos.splice(index, 1);
    res.status(200).json({ mensagem: `Veiculo ID ${id} removido com sucesso.` });
});

app.listen(PORT, () => {
    console.log(`[Binario Tech] API de Frotas rodando em http://localhost:${PORT}`);
});
```

---

### [PASSO 3] Execução e Testes via CLI

1. **Iniciar o servidor em segundo plano:**
   ```bash
   node frota_api.js &
   ```

2. **Testar GET (Listagem de todos os veículos):**
   ```bash
   curl -s http://localhost:3000/api/v1/veiculos | jq .
   ```

3. **Testar POST (Criar novo veículo):**
   ```bash
   curl -s -X POST http://localhost:3000/api/v1/veiculos \
     -H "Content-Type: application/json" \
     -d '{"placa":"VWX-5555","montadora":"Volkswagen","modelo":"Delivery"}' | jq .
   ```

4. **Testar PATCH (Atualizar status):**
   ```bash
   curl -s -X PATCH http://localhost:3000/api/v1/veiculos/1/status \
     -H "Content-Type: application/json" \
     -d '{"status":"MANUTENCAO"}' | jq .
   ```

5. **Testar DELETE (Remover veículo):**
   ```bash
   curl -s -X DELETE http://localhost:3000/api/v1/veiculos/2 | jq .
   ```

---

## 🎯 Bateria de Exercícios de Fixação

* **Exercício 01:** Efetue uma requisição GET buscando apenas o veículo de ID 1 e exiba o resultado formatado com `jq`.
  ```bash
  curl -s http://localhost:3000/api/v1/veiculos/1 | jq .
  ```

* **Exercício 02:** Cadastre um novo caminhão da montadora 'Volvo' (modelo 'FH 540', placa 'KLL-9090') via POST verificando o retorno `201 Created`.
  ```bash
  curl -i -s -X POST http://localhost:3000/api/v1/veiculos \
    -H "Content-Type: application/json" \
    -d '{"placa":"KLL-9090","montadora":"Volvo","modelo":"FH 540"}'
  ```

* **Exercício 03:** Tente cadastrar um veículo sem passar o campo `placa` para confirmar o retorno `400 Bad Request`.
  ```bash
  curl -i -s -X POST http://localhost:3000/api/v1/veiculos \
    -H "Content-Type: application/json" \
    -d '{"montadora":"Volvo","modelo":"FH 540"}'
  ```

* **Exercício 04:** Faça uma requisição GET filtrando os veículos por query param (`status=DISPONIVEL`).
  ```bash
  curl -s "http://localhost:3000/api/v1/veiculos?status=DISPONIVEL" | jq .
  ```

* **Exercício 05:** Atualize o status do veículo de ID 3 para 'EM_ROTA' utilizando a rota PATCH.
  ```bash
  curl -s -X PATCH http://localhost:3000/api/v1/veiculos/3/status \
    -H "Content-Type: application/json" \
    -d '{"status":"EM_ROTA"}' | jq .
  ```

* **Exercício 06:** Tente atualizar ou deletar um veículo com ID inexistente (ex: ID 99) para validar o código `404 Not Found`.
  ```bash
  curl -i -s -X DELETE http://localhost:3000/api/v1/veiculos/99
  ```

* **Exercício 07:** Adicione uma nova rota `PUT` na API (`/api/v1/veiculos/:id`) para substituir todos os dados de um veículo de uma só vez.

* **Exercício 08:** Crie um script Bash chamado `teste_crud.sh` que executa sequencialmente o cadastro de 2 veículos, atualiza 1 deles, deleta o outro, e registra os logs em `crud_result.log`.