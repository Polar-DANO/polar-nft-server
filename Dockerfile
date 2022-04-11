FROM node:16-alpine

COPY . /app
WORKDIR /app

RUN apk --no-cache update && \
    apk --no-cache upgrade && \
    yarn && \
    yarn build

CMD [ "yarn", "start" ]
EXPOSE 8080
