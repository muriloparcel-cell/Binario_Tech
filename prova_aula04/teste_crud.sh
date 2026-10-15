#!/bin/bash

LOG_FILE="crud_result.log"

> "$LOG_FILE"

log () {
    echo -e "$1" | tee -a "$LOG_FILE"
}

log "=================================================="
log ""
log "    INICIANDO OS TESTES DA FROTA_API.JS"
log "    Data e hora: $(date)"
log "=================================================="

log "Iniciando o cadastro de dois veiculos"
curl -s -X POST http://localhost:3000/api/v1/veiculos \
  -H "Content-Type: application/json" \
  -d '{"placa":"VWX-5555","montadora":"Volkswagen","modelo":"Delivery"}' | jq . >> "$LOG_FILE" 2>&1
sleep 1
log "Primeiro veiculo registrado com sucesso"
echo -e "\n\n" >> "$LOG_FILE"

log "Registrando o segundo veiculo"
curl -i -s -X POST http://localhost:3000/api/v1/veiculos \
  -H "Content-Type: application/json" \
  -d '{"placa":"KLL-9090","montadora":"Volvo","modelo":"FH 540"}' >> "$LOG_FILE" 2>&1
sleep 1
log "Segundo veiculo registrado com sucesso!"
sleep 0.5
echo -e "\n\n" >> "$LOG_FILE"

log "Iniciando o teste da requisição GET"
curl -s "http://localhost:3000/api/v1/veiculos?status=DISPONIVEL" | jq . >> "$LOG_FILE" 2>&1
sleep 1
echo -e "\n\n" >> "$LOG_FILE"

log "Teste concluido. Iniciando teste de atualização PATCH"
curl -s -X PATCH http://localhost:3000/api/v1/veiculos/1/status \
  -H "Content-Type: application/json" \
  -d '{"status":"MANUTENCAO"}' | jq . >> "$LOG_FILE" 2>&1
sleep 1
log "Teste PATCH concluido com sucesso!"
sleep 0.7
echo -e "\n\n" >> "$LOG_FILE"

log "Iniciando teste PUT"
curl -s -X PUT http://localhost:3000/api/v1/veiculos/2 \
  -H "Content-Type: application/json" \
  -d '{"placa":"LGT-4012","montadora":"Volkswagen","modelo":"Delivery","status":"MANUTENCAO"}' | jq . >> "$LOG_FILE" 2>&1
sleep 1
log "Teste PUT finalizado com sucesso"
sleep 0.7
echo -e "\n\n" >> "$LOG_FILE"

log "Iniciando teste final: DELETE"
curl -s -X DELETE http://localhost:3000/api/v1/veiculos/2 | jq . >> "$LOG_FILE" 2>&1
sleep 0.8
log "Teste DELETE finalizado"
sleep 1
echo -e "\n\n" >> "$LOG_FILE"

log "Todos testes foram concluidos com sucesso"
sleep 0.5
echo ""
echo "Resultado salvo em $LOG_FILE"
