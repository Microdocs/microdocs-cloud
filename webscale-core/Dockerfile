FROM node:8-alpine

WORKDIR /app/@webscale/core

# Install dependencies
ADD ./webscale-core/package.json ./
RUN yarn --frozen-lockfile && yarn cache clean

# Add build files
ADD ./webscale-core/tsconfig.json ./

CMD rm -rf ./dist/* && ./node_modules/.bin/tsc --watch
