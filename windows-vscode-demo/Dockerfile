FROM node:18.2-alpine

# install necessary software tools
RUN apk add --no-cache \
  zip \
  git \
  bash

# specify environment variables for Terraform Version and NodeJS production environment
ENV TERRAFORM_VERSION 1.2.0
ENV NODE_ENV production

# install Terraform
RUN wget -O terraform.zip https://releases.hashicorp.com/terraform/${TERRAFORM_VERSION}/terraform_${TERRAFORM_VERSION}_linux_amd64.zip && \
  unzip terraform.zip -d /usr/local/bin && \
  rm -f terraform.zip

# specify the working directory of the nodejs backend server
WORKDIR /app

# copy all files to the working directory.
# note: a .dockerignore file is used to ignore files that should not be copied such as node_modules
COPY ./ ./

# allow execution permissions on the entrypoint shell file
RUN chmod +x ./docker-entrypoint.sh && npm install && npm install pm2 --save -g

EXPOSE 5000

# invoke the entry point shell file on container start
ENTRYPOINT ["./docker-entrypoint.sh"]
