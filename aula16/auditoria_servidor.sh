#!/bin/bash

LOG="processos.log"

echo "============================================"
echo " AUDITORIA DE EXECUÇÃO DE PROCESSOS NODE.JS"
echo "============================================"

echo -e "Identificando todos os processos node.js ativos"
ps aux | grep node >> ./processos.log

echo -e "Resultado da identificação"
sleep 2
cat processos.log
