#!/bin/bash
echo "========================================="
echo "     INICIANDO OS TESTES DO SERVIDOR "
echo "========================================="

echo -e "\n[1] Testando rota: /status"
http GET http://localhost:3028/status

echo -e "\n[1] Testando rota: /scania"
http GET http://localhost:3028/scania/info

echo -e "\n[3] Testando rota: /vw"
http GET http://localhost:3028/vw/info

echo -e "\n-----------------------------------------"
echo "Auditoria finalizada com sucesso!"
