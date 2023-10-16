FROM mcr.microsoft.com/devcontainers/typescript-node:1-20-bullseye As development

WORKDIR usr/src/app

COPY package*.json yarn.lock ./

RUN npm install -g npm@latest

RUN yarn install

COPY . .

ENTRYPOINT ["tail", "-f", "/dev/null"]



# ? Alternative dev container entrypoint command
# CMD
# - /bin/sh
        # - -c
        # - |
        #     echo fcc-nestjs-api started!
        #     trap "exit 0" 15
        #     exec "$@"
        #     while sleep 1 & wait $!; do :; done