FROM alpine:3.16.0

RUN apk add --no-cache \
  zip \
  git \
  bash


ENV TERRAFORM_VERSION 1.2.0

RUN wget -O terraform.zip https://releases.hashicorp.com/terraform/${TERRAFORM_VERSION}/terraform_${TERRAFORM_VERSION}_linux_amd64.zip && \
  unzip terraform.zip -d /usr/local/bin && \
  rm -f terraform.zip

WORKDIR /terraform-k8s-gp-backend

COPY ./ ./

CMD tail -f /dev/null