#!/bin/bash
echo "===================================================="
echo "  INICIANDO PROCESSO DE LIMPEZA DO AMBIENTE DOCKER"
echo "===================================================="

echo "\n[LIMPEZA] Limpando os containers inativos"
docker container prune --filter "until=24h" -f
sleep 1

echo "\n[LIMPEZA] Removendo Imagens Pendentes"
docker image prune --filter "dangling=true" -f
sleep 1

echo "================================="
echo "        LIMPEZA CONCLUIDA"
echo "================================="
