FROM alpine:3.16.0

RUN apk add --no-cache \
  zip \
  git \
  bash \
  curl


ENV TERRAFORM_VERSION 1.2.0

RUN wget -O terraform.zip https://releases.hashicorp.com/terraform/${TERRAFORM_VERSION}/terraform_${TERRAFORM_VERSION}_linux_amd64.zip && \
  unzip terraform.zip -d /usr/local/bin && \
  rm -f terraform.zip

RUN cd ~ && \
  wget https://github.com/digitalocean/doctl/releases/download/v1.76.0/doctl-1.76.0-linux-amd64.tar.gz && \
  tar xf ~/doctl-1.76.0-linux-amd64.tar.gz && \
  mv ~/doctl /usr/local/bin

RUN curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" && \
  install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl


WORKDIR /terraform-k8s-gp-backend

COPY ./ ./

CMD tail -f /dev/null