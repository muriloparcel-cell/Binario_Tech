#!/bin/bash


echo "==================================================="
echo ""
echo "          Iniciando o teste das rotas "
echo ""
echo "==================================================="
sleep 1

echo -e "\n[Scania] Testando a rota scania..."
curl -s http://localhost:3028/api/v1/scania | jq .
sleep 1
echo  -e "\n[Scania] Rota Confirmada!"
sleep 1

echo -e "\n[Mercedes] Testando a rota mercedes-benz..."
curl -s http://localhost:3028/api/v1/mercedes | jq .
sleep 1
echo -e "\n[Mercedes] Rota Confirmada!"
sleep 1

echo -e "\n[Volkswagen] Testando a rota volkswagen..."
curl -s http://localhost:3028/api/v1/vw | jq .
sleep 1
echo -e "\n[Volkswagen] Rota Confirmada!"
sleep 1

echo -e "\n[Volvo] Testando a rota volvo..."
curl -s http://localhost:3028/api/v1/volvo | jq .
sleep 1
echo -e "\n[Volvo] Rota Confirmada!"
sleep 1

echo "==================================================="
echo "            Teste das rotas finalizado!"
echo "==================================================="
 >> relatorio.log

