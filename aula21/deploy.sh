#!/bin/bash
echo "=================================================="
echo "    PIPELINE DE DEPLOY AUTOMATIZADO - BINÁRIO TECH"
echo "=================================================="


#esse caminho so funciona pelo cloud, pois no servidor da aula o caminho esta home/binario... e nao home/curso/binario
REPO_DIR="$HOME/curso-pbe1/binario_tech"

APP_NAME="api-cicd"
PORT=3028

echo "[1/4] Atualizando código-fonte do repositório remoto..."
cd $REPO_DIR
git pull origin main

COMMIT_HASH=$(git rev-parse --short HEAD)

echo "[2/4] Verificando e instalando novas dependências..."
cd $REPO_DIR/aula21
npm install --production

echo "[3/4] Reiniciando aplicação no PM2..."
pm2 restart $APP_NAME

echo "[4/4] Executando Smoke Test na API (Porta $PORT)..."
sleep 2
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT/api/v1/versao)

if [ "$HTTP_STATUS" -eq 200 ]; then
  echo -e "\n[SUCESSO] Deploy realizado e verificado com sucesso! HTTP Status 200."
  pm2 list | grep $APP_NAME

  echo "$(date '+%Y-%m-%d %H:%M:%S') - Deploy com sucesso - Commit: $COMMIT_HASH" >> $REPO_DIR/aula21/deploy_history.log

else
  echo -e "\n[FALHA] Smoke Test falhou com status $HTTP_STATUS! Verifique os logs do PM2."
  pm2 logs $APP_NAME --lines 20
  exit 1
fi
echo "=================================================="
