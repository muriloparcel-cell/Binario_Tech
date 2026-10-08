============================================================================================
# Servidor de Telemetria - Binário Tech (Aula 03)

Projeto desenvolvido durante a aula prática da **Binário Tech** no ambiente Google Cloud Shell. O sistema simula um servidor API Express em Node.js para consulta de dados de telemetria de veículos pesados (Scania, Mercedes-Benz, Volkswagen e Volvo) e inclui scripts em Bash para automação de testes e auditorias.

============================================================================================

# Tecnologias e Ferramentas Utilizadas

* **Node.js** & **Express** — Criação do servidor HTTP e rotas de API REST JSON.
* **cURL** — Cliente CLI para realizar requisições HTTP.
* **HTTPie** — Cliente HTTP alternativo com sintaxe simplificada e formatada.
* **jq** — Processador de JSON via linha de comando para filtragem de dados.
* **Bash Shell Scripting** — Automação de testes e auditoria de rotas.

============================================================================================

#  Estrutura do Projeto


aula03/
├── package.json          # Configuração de dependências e scripts do Node.js
├── package-lock.json     # Mapeamento exato de versões das dependências
├── telemetria.js         # Aplicação principal (Servidor Express)
├── testar_telemetria.sh  # Script Bash de automação de testes de rotas
├── mercedes.json         # Log/resposta gerado via HTTPie (Exercício 02)
├── scania.json           # Log/resposta do endpoint Scania
└── relatorio.log         # Arquivo de log da execução da auditoria (Exercício 06)


============================================================================================

#  Como Configurar e Executar

## 1. Pré-requisitos e Instalação

Acesse o diretório do projeto e instale as dependências do Node.js e as ferramentas de terminal:


cd ~/binario_tech/aula03
npm install
sudo apt-get update && sudo apt-get install -y jq httpie


## 2. Executando o Servidor

Você pode iniciar o servidor de duas formas:

 Modo padrão (via NPM script):

  npm start


 Em segundo plano (Background Process):

  node telemetria.js &


O servidor estará rodando na porta 3028: `http://localhost:3028`.

============================================================================================

# Endpoints da API

| Método|        Rota        |                 Descrição                     |                                    Exemplo de Resposta                                               |
| `GET` | `/api/v1/scania` | Retorna status de telemetria da Scania | `{"montadora":"Scania","modelo":"R450","status":"OK","conexao":true,"velocidade_media":82}` |
| `GET` | `/api/v1/mercedes` | Retorna status de telemetria da Mercedes-Benz | `{"montadora":"Mercedes-Benz","modelo":"Actros","status":"OK","conexao":true,"velocidade_media":78}` |
| `GET` | `/api/v1/vw` | Retorna status de telemetria da Volkswagen | `{"montadora":"Volkswagen","modelo":"Delivery","status":"ALERTA","conexao":false,"velocidade_media":0}` |
| `GET` | `/api/v1/volvo` | Retorna status de telemetria da Volvo | `{"montadora":"Volvo","modelo":"FH 540","status":"OK","conexao":true,"velocidade_media":85}` |

============================================================================================

# Script de Automação de Testes

Para executar o script de auditoria automatizada use

chmod +x testar_telemetria.sh
./testar_telemetria.sh


============================================================================================

# Resoluções da Bateria de Exercícios

Abaixo estão os comandos executados para responder aos exercícios práticos da aula:

* Exercício 01: Obter apenas a chave `modelo` da Scania via cURL + jq

  curl -s http://localhost:3028/api/v1/scania | jq '.modelo'


* Exercício 02: Salvar requisição da Mercedes usando HTTPie

  http http://localhost:3028/api/v1/mercedes > mercedes.json
  ou
  curl -s http://localhost:3028/api/v1/mercedes > mercedes.json


* Exercício 03: Filtrar campo `status` do arquivo `mercedes.json`

  cat mercedes.json | jq '.status'


* Exercício 04: Adicionar rota `/api/v1/volvo` no `telemetria.js`
  Adicionada a rota no servidor:

  app.get('/api/v1/volvo', (req, res) => {
      res.json({ montadora: "Volvo", modelo: "FH 540", status: "OK", conexao: true, velocidade_media: 85 });
  });


* Exercício 05: Configurar o script `"start"` no `package.json`
  No arquivo `package.json`, adicione na propriedade `"scripts"`:

  "scripts": {
    "start": "node telemetria.js"
  }


* Exercício 06: Redirecionar relatório de testes para `relatorio.log`

  ./testar_telemetria.sh > relatorio.log


* Exercício 07: Exibir `montadora` e `status` da VW em chamada única no `jq`

  curl -s http://localhost:3028/api/v1/vw | jq '{montadora, status}'


* Exercício 08: Encontrar e encerrar o processo Node.js

  ps aux | grep node
  kill -9 <PID>

============================================================================================
