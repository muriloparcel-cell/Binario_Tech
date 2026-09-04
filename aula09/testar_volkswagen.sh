#!/bin/bash
echo "====================================================="
echo " CADASTRO E TELEMETRIA - VOLKSWAGEN DELIVERY"
echo "====================================================="

# 1. Cadastrar Veículo e capturar o ID retornado dinamicamente
RESPONSE_VEICULO=$(curl -s -X POST http://localhost:3000/api/v1/telemetria/veiculo-teste \
  -H "Content-Type: application/json" \
  -d '{
    "placa": "DEL-1234",
    "montadora": "Volkswagen",
    "modelo": "Delivery"
  }')

echo -e "\n[1] Veículo Cadastrado:"
echo "$RESPONSE_VEICULO" | jq .

# Extrai o ID do JSON retornado
VEICULO_ID=$(echo "$RESPONSE_VEICULO" | jq -r '.id')

if [ "$VEICULO_ID" == "null" ] || [ -z "$VEICULO_ID" ]; then
  echo -e "\n[ERRO] Falha ao capturar o ID do veículo. Encerrando o script."
  exit 1
fi

echo -e "\n-> ID Gerado Dinamicamente: $VEICULO_ID"

# 2. Primeira Leitura (Temperatura Normal)
echo -e "\n[2] Cadastrando Leitura 1 (Normal)..."
curl -s -X POST http://localhost:3000/api/v1/telemetria \
  -H "Content-Type: application/json" \
  -d "{
    \"veiculo_id\": $VEICULO_ID,
    \"velocidade\": 65.0,
    \"temperatura_motor\": 87.5
  }" | jq .

# 3. Segunda Leitura (Alerta de Alta Temperatura > 95°C)
echo -e "\n[3] Cadastrando Leitura 2 (Alerta)..."
curl -s -X POST http://localhost:3000/api/v1/telemetria \
  -H "Content-Type: application/json" \
  -d "{
    \"veiculo_id\": $VEICULO_ID,
    \"velocidade\": 92.0,
    \"temperatura_motor\": 99.0
  }" | jq .

# 4. Consultar o histórico do veículo recém-criado
echo -e "\n[4] Consultando Leituras do Veículo ID $VEICULO_ID..."
curl -s "http://localhost:3000/api/v1/telemetria/veiculo/$VEICULO_ID" | jq .
