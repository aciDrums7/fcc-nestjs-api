FROM mcr.microsoft.com/devcontainers/typescript-node:1-20-bullseye As development

WORKDIR usr/src/app

COPY package*.json yarn.lock ./

RUN yarn install

RUN yarn add @nestjs/cli

RUN yarn add --dev prisma@latest

RUN yarn add @prisma/client@latest

COPY . .

ENTRYPOINT ["tail", "-f", "/dev/null"]