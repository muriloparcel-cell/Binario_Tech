#!/bin/bash

LOG_FILE="crud_result.log"
API_URL="http://localhost:3000/api/v1/veiculos"

> "$LOG_FILE"

echo "==========================================" | tee -a "$LOG_FILE"
echo " INICIANDO TESTE BASH DA API DE VEÍCULOS " | tee -a "$LOG_FILE"
echo " Data: $(date)" | tee -a "$LOG_FILE"
echo -e "==========================================\n" | tee -a "$LOG_FILE"

# 1. Cadastra Veículo 1
echo ">>> [1/4] Cadastrando Veículo 1 (Volvo FH 540)..." | tee -a "$LOG_FILE"
RESPONSE_1=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{"modelo": "FH 540", "montadora": "Volvo", "placa": "ABC1D23"}')

echo "Resposta:" | tee -a "$LOG_FILE"
echo -e "$RESPONSE_1\n" | tee -a "$LOG_FILE"

# Extrai o ID dinâmico retornado pela API
ID_1=$(echo "$RESPONSE_1" | grep -o '"id":[0-9]*' | head -n 1 | cut -d':' -f2)

# 2. Cadastra Veículo 2
echo ">>> [2/4] Cadastrando Veículo 2 (Scania R450)..." | tee -a "$LOG_FILE"
RESPONSE_2=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{"modelo": "R450", "montadora": "Scania", "placa": "XYZ9K88"}')

echo "Resposta:" | tee -a "$LOG_FILE"
echo -e "$RESPONSE_2\n" | tee -a "$LOG_FILE"

# Extrai o ID dinâmico retornado pela API
ID_2=$(echo "$RESPONSE_2" | grep -o '"id":[0-9]*' | head -n 1 | cut -d':' -f2)

# 3. Atualiza STATUS via PATCH (/api/v1/veiculos/:id/status)
echo ">>> [3/4] Atualizando (PATCH) status do Veículo ID $ID_1 para EM_ROTA..." | tee -a "$LOG_FILE"
RESPONSE_3=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X PATCH "$API_URL/$ID_1/status" \
  -H "Content-Type: application/json" \
  -d '{"status": "EM_ROTA"}')

echo "Resposta:" | tee -a "$LOG_FILE"
echo -e "$RESPONSE_3\n" | tee -a "$LOG_FILE"

# 4. Deleta Veículo 2 via DELETE (/api/v1/veiculos/:id)
echo ">>> [4/4] Deletando Veículo ID $ID_2..." | tee -a "$LOG_FILE"
RESPONSE_4=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X DELETE "$API_URL/$ID_2")

echo "Resposta:" | tee -a "$LOG_FILE"
echo -e "$RESPONSE_4\n" | tee -a "$LOG_FILE"

echo "==========================================" | tee -a "$LOG_FILE"
echo " TESTE FINALIZADO! Logs salvos em $LOG_FILE" | tee -a "$LOG_FILE"
echo "==========================================" | tee -a "$LOG_FILE"
