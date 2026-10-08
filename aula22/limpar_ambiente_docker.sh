#!/bin/bash
echo "===================================================="
echo "  INICIANDO PROCESSO DE LIMPEZA DO AMBIENTE DOCKER"
echo "===================================================="

echo "[CONTAINER] Limpando os containers inativos"
docker container prune --filter "until=24h" -f
sleep 1

echo "\n[IMAGEM] Removendo Imagens Pendentes"
docker image prune --filter "dangling=true" -f
sleep 1

echo "================================="
echo "        LIMPEZA CONCLUIDA"
echo "================================="
