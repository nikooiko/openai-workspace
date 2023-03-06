ARG NODE_TAG=19.4.0

FROM node:$NODE_TAG as dev
USER node
WORKDIR /node
# copies package.json, package-lock.json, nest-cli, tsconfig.build.json and tsconfig.json
COPY *.json ./
RUN npm ci
ENV PATH /node/node_modules/.bin:$PATH
COPY src ./src
COPY test ./test
ENV NODE_ENV=development
RUN npm run build
CMD npm run start:dev

FROM node:$NODE_TAG-slim as production-build
USER node
WORKDIR /node
COPY *.json ./
ENV NODE_ENV=production
RUN npm ci
COPY --from=dev /node/dist ./dist

FROM node:$NODE_TAG-slim as production
USER node
WORKDIR /node
COPY *.json ./
COPY --from=production-build /node/node_modules ./node_modules
COPY --from=production-build /node/dist ./dist
ENV NODE_ENV=production
CMD npm run start:prod