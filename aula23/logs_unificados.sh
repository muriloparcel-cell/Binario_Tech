#!/bin/bash

echo "===================================================="
echo "  Monitorando os logs combinados da API e do Redis"
echo "===================================================="

echo -e "\n[Monitorando] Iniciando o monitoramento dos logs da API e do Redis..."
docker compose logs -f --tail=20
sleep 1

echo "---------------------------------------------"
echo "           Processo Finalizado"
echo "---------------------------------------------"
