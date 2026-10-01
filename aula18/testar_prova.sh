echo "=============================================="
echo " PROVA INTERMEDIÁRIA - BINÁRIO TECH - AULA 18"
echo "=============================================="

echo -e "\n[1] Registrando novo Usuário..."
curl -s -X POST http://localhost:3028/api/v1/prova/register \
  -H "Content-Type: application/json" \
  -d '{ "email": "instrutor@binariotech.com.br", "senha": "SenhaSegura123" }' | jq .

echo -e "\n[2] Realizando Login e obtendo JWT..."
LOGIN_RESP=$(curl -s -X POST http://localhost:3028/api/v1/prova/login \
  -H "Content-Type: application/json" \
  -d '{ "email": "instrutor@binariotech.com.br", "senha": "SenhaSegura123" }')

echo $LOGIN_RESP | jq .

TOKEN=$(echo "$LOGIN_RESP" | jq -r '.token')

echo -e "\n[3] Acessando Rota Protegida COM Token JWT Válido (Esperado HTTP 200)..."
curl -s http://localhost:3028/api/v1/prova/relatorio \
  -H "Authorization: Bearer $TOKEN" | jq .
