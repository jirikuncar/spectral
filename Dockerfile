FROM node:12 as compiler

WORKDIR /usr/src/spectral

COPY package.json tsconfig.rollup.json rollup.config.js yarn.lock tsconfig.build.json tsconfig.json /usr/src/spectral/
COPY scripts/ /usr/src/spectral/scripts
COPY src/ /usr/src/spectral/src/

RUN yarn && yarn build

###############################################################
FROM node:12 as dependencies

WORKDIR /usr/src/spectral/

COPY package.json /usr/src/spectral/

ENV NODE_ENV production
RUN yarn --production

RUN curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash
RUN ./bin/node-prune

###############################################################
FROM node:12-alpine

WORKDIR /usr/src/spectral
ENV NODE_ENV production

COPY package.json /usr/src/spectral/

COPY --from=compiler /usr/src/spectral/dist /usr/src/spectral/dist
COPY --from=dependencies /usr/src/spectral/node_modules/ /usr/src/spectral/node_modules/

ENTRYPOINT [ "node", "/usr/src/spectral/dist/cli/index.js" ]
