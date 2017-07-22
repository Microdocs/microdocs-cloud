FROM node:6

WORKDIR /app/@webscale/order-service

# Install dependencies
ADD ./webscale-rest-client/package.json ./node_modules/@webscale/rest-client/
ADD ./webscale-rest-client-node/package.json ./node_modules/@webscale/rest-client-node/
ADD ./examples/order-service/package.json ./
RUN npm install

# Add build files
ADD ./examples/order-service/gulpfile.js ./examples/order-service/tsconfig.json ./

CMD rm -rf ./dist/* && ./node_modules/.bin/gulp watch
