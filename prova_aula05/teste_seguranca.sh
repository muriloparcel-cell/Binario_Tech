#!/bin/bash

LOG_FILE="audit_seguranca.log"

# Redireciona stdout e stderr para o log e exibe no terminal ao mesmo tempo
exec > >(tee -a "$LOG_FILE") 2>&1

API_URL="http://localhost:3028/api/v1"
API_KEY="binario-tech-secret-2026"

echo "=========================================="
echo "    INICIANDO AUDITORIA DE SEGURANÇA      "
echo "=========================================="
echo ""

echo "--- 1. Teste Sem Autenticação (401 Unauthorized) ---"
curl -s "${API_URL}/motoristas"
echo -e "\n\n"

echo "--- 2. Teste Com Chave Inválida (401 Unauthorized) ---"
curl -s -H "X-API-KEY: chave-incorreta" "${API_URL}/motoristas" | jq .
echo -e "\n\n"

echo "--- 3. Teste Validação de CNH Inválida (400 Bad Request) ---"
curl -s -X POST "${API_URL}/motoristas" \
  -H "X-API-KEY: ${API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"nome": "Carlos Teste", "cnh": "12345"}' | jq .
echo -e "\n\n"

echo "--- 4. Teste Rota Inexistente (404 Not Found) ---"
curl -s -H "X-API-KEY: ${API_KEY}" "${API_URL}/clientes" | jq .
echo -e "\n\n"

echo "--- 5. Teste Cadastro Bem-sucedido (201 Created) ---"
curl -s -X POST "${API_URL}/motoristas" \
  -H "X-API-KEY: ${API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"nome": "Maria Oliveira", "cnh": "98765432100"}' | jq .
echo -e "\n\n"

echo "--- 5. Teste Cadastro Bem-sucedido (201 Created) ---"
curl -s -X POST "${API_URL}/manutencoes" \
  -H "X-API-KEY: ${API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"placa": "TYP-9510", "descricao": "Troca de pneus"}' | jq .
echo -e "\n\n"



echo "=========================================="
echo "         AUDITORIA CONCLUÍDA              "
echo "=========================================="

