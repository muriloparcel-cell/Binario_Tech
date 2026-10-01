#!/bin/bash
echo "Últimas requisições com status 200 OK:"
tail -n 15 /var/log/nginx/access.log | grep '" 200 '
