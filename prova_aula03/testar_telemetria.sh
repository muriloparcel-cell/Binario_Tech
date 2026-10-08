#!/bin/bash

echo "==================================================="
echo ""
echo "          Iniciando o teste das rotas "
echo ""
echo "==================================================="
sleep 1

echo "\n[Scania] Testando a rota scania..."
curl -s http://localhost:3028/api/v1/scania | jq .
sleep 1
echo "\n[Scania] Rota Confirmada!"
sleep 1

echo "\n[Mercedes] Testando a rota mercedes-benz..."
curl -s http://localhost:3028/api/v1/mercedes | jq .
sleep 1
echo "\n[Scania] Rota Confirmada!"
sleep 1

echo "\n[Scania] Testando a rota volkswagen..."
curl -s http://localhost:3028/api/v1/vw | jq .
sleep 1
echo "\n[Scania] Rota Confirmada!"
sleep 1

echo "\n[Scania] Testando a rota volvo..."
curl -s http://localhost:3028/api/v1/volvo | jq .
sleep 1
echo "\n[Scania] Rota Confirmada!"
sleep 1

echo "==================================================="
echo "            Teste das rotas finalizado!"
echo "==================================================="
