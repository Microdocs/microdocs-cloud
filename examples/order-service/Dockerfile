FROM node:6

WORKDIR /app/@microdocs/order-service

# Install dependencies
ADD ./microdocs-cloud-rest-client/package.json ./node_modules/@microdocs/cloud-rest-client/
ADD ./microdocs-cloud-rest-client-node/package.json ./node_modules/@microdocs/cloud-rest-client-node/
ADD ./examples/order-service/package.json ./
RUN npm install

# Add build files
ADD ./examples/order-service/gulpfile.js ./examples/order-service/tsconfig.json ./

CMD rm -rf ./dist/* && ./node_modules/.bin/gulp watch
