FROM node:18.2-alpine

RUN apk add --no-cache \
  zip \
  git \
  bash


ENV TERRAFORM_VERSION 1.2.0
ENV NODE_ENV production


RUN wget -O terraform.zip https://releases.hashicorp.com/terraform/${TERRAFORM_VERSION}/terraform_${TERRAFORM_VERSION}_linux_amd64.zip && \
  unzip terraform.zip -d /usr/local/bin && \
  rm -f terraform.zip

WORKDIR /app

COPY ./ ./

RUN chmod +x ./docker-entrypoint.sh && npm install && npm install pm2 --save -g

EXPOSE 5000

ENTRYPOINT ["./docker-entrypoint.sh"]
