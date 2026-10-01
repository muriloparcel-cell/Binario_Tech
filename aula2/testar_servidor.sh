#!/bin/bash
echo "========================================="
echo "     INICIANDO OS TESTES DO SERVIDOR "
echo "========================================="

echo -e "\n[1] Testando rota: /status"
curl -s http://localhost:3028/status | jq .

echo -e "\n[1] Testando rota: /scania"
curl -s http://localhost:3028/scania/info | jq .

echo -e "\n[3] Testando rota: /vw"
curl -s http://localhost:3028/vw/info | jq .

echo -e "\n-----------------------------------------"
echo "Auditoria finalizada com sucesso!"
