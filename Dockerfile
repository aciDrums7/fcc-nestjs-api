FROM mcr.microsoft.com/devcontainers/typescript-node:1-20-bullseye As development

WORKDIR usr/src/app

COPY package*.json yarn.lock ./

RUN npm install -g npm@latest

RUN yarn install

COPY . .

CMD ["tail", "-f", "/dev/null"]

# ? ENTRYPOINT is like CMD but appends a terminal param when you 'docker run' the image
#5 i.e. ENTRYPOINT ["sleep"] -> 'docker run my-image 10' -> sleep 10
#3 for default value, use CMD after ENTRYPOINT:
#2 ENTRYPOINT ["sleep"]
#1 CMD["5"] -> default 'sleep 5


# ? Alternative container start command
# CMD
# - /bin/sh
        # - -c
        # - |
        #     echo fcc-nestjs-api started!
        #     trap "exit 0" 15
        #     exec "$@"
        #     while sleep 1 & wait $!; do :; done