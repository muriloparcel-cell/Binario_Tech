#!/bin/bash

# Configurações do servidor e arquivo de saída
URL_BASE="http://localhost:3000/api/v1/telemetria"
LOG_FILE="auditoria.log"

# Função para registrar e exibir mensagens no console e no arquivo de log
log() {
  local MENSAGEM="$1"
  echo "$MENSAGEM"
  echo "$MENSAGEM" >> "$LOG_FILE"
}

# Inicialização do log com cabeçalho
echo "==================================================" > "$LOG_FILE"
log "   INICIANDO AUDITORIA DE TELEMETRIA - $(date)"
echo "==================================================" >> "$LOG_FILE"

# Função auxiliar para disparar requisições e formatar log
testar_endpoint() {
  local METODO="$1"
  local ENDPOINT="$2"
  local DESCRIPTION="$3"
  local BODY_DATA="$4"

  log ""
  log "--------------------------------------------------"
  log "TESTE: $DESCRIPTION"
  log "ROTA: $METODO $ENDPOINT"

  if [ "$METODO" == "GET" ]; then
    RESPOSTA=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X GET "$ENDPOINT")
  else
    RESPOSTA=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "$ENDPOINT" \
      -H "Content-Type: application/json" \
      -d "$BODY_DATA")
  fi

  # Separa o corpo da resposta do status HTTP
  HTTP_BODY=$(echo "$RESPOSTA" | sed -e 's/HTTP_STATUS:.*//g')
  HTTP_STATUS=$(echo "$RESPOSTA" | tr -d '\n' | sed -e 's/.*HTTP_STATUS://')

  log "STATUS HTTP: $HTTP_STATUS"
  log "RESPOSTA: $HTTP_BODY"
}

# ==================================================
# 1. TESTES DAS ROTAS SCANIA
# ==================================================
log ""
log ">>> [1/2] AUDITANDO MÓDULO SCANIA <<<"

# 1.1 Listar Telemetria Scania
testar_endpoint "GET" "$URL_BASE/scania" "Listar Telemetria Scania"

# 1.2 Registrar Telemetria Scania (Sucesso - VIN de 12 caracteres)
BODY_SCANIA_OK='{
  "modelo": "R500",
  "vin": "9BS123456789",
  "temperatura_motor": 92
}'
testar_endpoint "POST" "$URL_BASE/scania" "Registrar Telemetria Scania (Sucesso)" "$BODY_SCANIA_OK"

# 1.3 Registrar Telemetria Scania (Falha - VIN Inválido)
BODY_SCANIA_ERRO='{
  "modelo": "R450",
  "vin": "VIN_CURTO"
}'
testar_endpoint "POST" "$URL_BASE/scania" "Registrar Telemetria Scania (Erro de VIN)" "$BODY_SCANIA_ERRO"


# ==================================================
# 2. TESTES DAS ROTAS MERCEDES-BENZ
# ==================================================
log ""
log ">>> [2/2] AUDITANDO MÓDULO MERCEDES-BENZ <<<"

# 2.1 Listar Frota Mercedes
testar_endpoint "GET" "$URL_BASE/mercedes/caminhoes" "Listar Frota Mercedes-Benz"

# 2.2 Buscar Caminhão Mercedes por ID
testar_endpoint "GET" "$URL_BASE/mercedes/caminhoes/1" "Buscar Caminhão Mercedes por ID"

# 2.3 Cadastrar Caminhão Mercedes (Sucesso - Actros com VIN de 12 caracteres)
BODY_MERCEDES_OK='{
  "modelo": "Actros",
  "versao": "2651 6x4",
  "ano": 2024,
  "capacidadeCargaTons": 26,
  "vin": "MBZ123456789"
}'
testar_endpoint "POST" "$URL_BASE/mercedes/caminhoes" "Cadastrar Caminhão Mercedes (Sucesso)" "$BODY_MERCEDES_OK"

# 2.4 Cadastrar Caminhão Mercedes (Falha - Modelo Inválido)
BODY_MERCEDES_ERRO_MODELO='{
  "modelo": "Accelo",
  "versao": "1016",
  "vin": "MBZ987654321"
}'
testar_endpoint "POST" "$URL_BASE/mercedes/caminhoes" "Cadastrar Caminhão Mercedes (Erro Modelo Inválido)" "$BODY_MERCEDES_ERRO_MODELO"

# ==================================================
# 3. TESTE DE ROTA INEXISTENTE (404)
# ==================================================
log ""
log ">>> [3/3] AUDITANDO ROTA 404 <<<"
testar_endpoint "GET" "$URL_BASE/volvo/caminhoes" "Testar Rota Não Mapeada"

log ""
log "=================================================="
log "   AUDITORIA CONCLUÍDA - LOG SALVO EM: $LOG_FILE"
log "=================================================="
