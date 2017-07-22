FROM node:6

WORKDIR /app/@webscale/product-service

# Install dependencies
ADD ./webscale-rest-client/package.json ./node_modules/@webscale/rest-client/
ADD ./webscale-rest-client-node/package.json ./node_modules/@webscale/rest-client-node/
ADD ./examples/product-service/package.json ./
RUN npm install

# Add build files
ADD ./examples/product-service/gulpfile.js ./examples/product-service/tsconfig.json ./

CMD rm -rf ./dist/* && ./node_modules/.bin/gulp watch
