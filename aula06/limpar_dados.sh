#!/bin/bash

echo "====================================================="
echo "   RESETANDO AMBIENTE DE TESTES - BINARIO TECH"
echo "====================================================="

# 1. Encerra o processo Node.js rodando na porta 3000 (ou qualquer processo node da aplicação)
echo -e "\n[1] Encerrando o processo Node.js..."

# Tenta derrubar pelo processo escutando na porta 3000 ou pelo nome do processo
if command -v fuser &> /dev/null; then
    fuser -k 3000/tcp &> /dev/null
else
    pkill -f "node" &> /dev/null
fi

echo "   Processos encerrados com sucesso."

# 2. Exclui o arquivo de persistência no disco
echo -e "\n[2] Removendo arquivo ocorrencias.json..."

if [ -f "ocorrencias.json" ]; then
    rm -f ocorrencias.json
    echo "   Arquivo 'ocorrencias.json' removido com sucesso."
else
    echo "   Arquivo 'ocorrencias.json' não encontrado (já limpo)."
fi

echo -e "\n====================================================="
echo "   Ambiente resetado! Você já pode iniciar a API."
echo "====================================================="
