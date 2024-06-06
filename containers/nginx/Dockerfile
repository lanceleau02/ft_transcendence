FROM nginx:1.19.0-alpine


RUN apk add --no-cache openssl

RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/key.pem -out /etc/nginx/cert.pem \
    -subj "/C=FR/ST=NAQ/L=Angouleme/O=42/OU=42/CN=localhost/UID=login"

COPY ./default.conf /etc/nginx/conf.d/default.conf
