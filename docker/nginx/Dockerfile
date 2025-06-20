FROM nginx:stable-alpine

# Instalar Certbot e dependências
RUN apk add --no-cache certbot certbot-nginx bash curl

# Copiar configuração nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Script para renovar certificados e iniciar nginx
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80 443

ENTRYPOINT ["/entrypoint.sh"]