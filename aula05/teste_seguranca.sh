#!/bin/bash

# Arquivo de log de saída
LOG_FILE="audit_seguranca.log"

# Limpa/inicializa o arquivo de log
> "$LOG_FILE"

echo "==========================================" >> "$LOG_FILE"
echo "INICIANDO AUDITORIA DE SEGURANÇA DA API" >> "$LOG_FILE"
echo "Data/Hora: $(date)" >> "$LOG_FILE"
echo "==========================================" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

# 1. Três tentativas SEM chave de API válida
echo "--- [TESTES DE ACESSO NÃO AUTORIZADO] ---" >> "$LOG_FILE"

for i in {1..3}; do
  echo "[Tentativa $i/3] GET /api/v1/motoristas (Sem X-API-KEY / Chave Inválida)" >> "$LOG_FILE"
  
  # Requisição curl capturando status HTTP e resposta JSON
  HTTP_STATUS=$(curl -s -o /tmp/resp_tmp.json -w "%{http_code}" -X GET http://localhost:3000/api/v1/motoristas)
  RESPONSE=$(cat /tmp/resp_tmp.json)
  
  echo "Status HTTP: $HTTP_STATUS" >> "$LOG_FILE"
  echo "Resposta: $RESPONSE" >> "$LOG_FILE"
  echo "------------------------------------------" >> "$LOG_FILE"
  
  sleep 1
done

echo "" >> "$LOG_FILE"

# 2. Uma tentativa COM chave de API válida
echo "--- [TESTE DE ACESSO AUTORIZADO] ---" >> "$LOG_FILE"
echo "[Tentativa 4/4] GET /api/v1/motoristas (Com X-API-KEY válida)" >> "$LOG_FILE"

HTTP_STATUS=$(curl -s -o /tmp/resp_tmp.json -w "%{http_code}" -X GET http://localhost:3000/api/v1/motoristas -H "X-API-KEY: binario-tech-secret-2026")
RESPONSE=$(cat /tmp/resp_tmp.json)

echo "Status HTTP: $HTTP_STATUS" >> "$LOG_FILE"
echo "Resposta: $RESPONSE" >> "$LOG_FILE"
echo "==========================================" >> "$LOG_FILE"
echo "AUDITORIA FINALIZADA" >> "$LOG_FILE"

# Limpa arquivo temporário
rm -f /tmp/resp_tmp.json

echo "Auditoria concluída! Resultados salvos em $LOG_FILE"
