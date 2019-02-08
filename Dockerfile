FROM alpine:3.7

RUN apk update
RUN apk --no-cache add \
    tzdata \
    su-exec \
    ca-certificates \
    s6 \
    curl \
    openssh \
    bash \
    make 
RUN apk --no-cache add nodejs-lts --update 
WORKDIR /
COPY . /
RUN npm install
ENTRYPOINT [ "npm","start" ]
