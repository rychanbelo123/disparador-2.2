#!/bin/sh

DOMAIN="your-domain.com"
EMAIL="your-email@example.com"

# Função para obter ou renovar certificado
obtain_cert() {
  certbot certonly --nginx --non-interactive --agree-tos --email $EMAIL -d $DOMAIN || true
}

# Obter certificado na primeira execução
if [ ! -d "/etc/letsencrypt/live/$DOMAIN" ]; then
  echo "Obtendo certificado para $DOMAIN..."
  obtain_cert
fi

# Iniciar nginx em background
nginx

# Renovar certificado a cada 12 horas
while true; do
  sleep 43200
  echo "Renovando certificado para $DOMAIN..."
  certbot renew --quiet
  nginx -s reload
done
</dyad.sh>