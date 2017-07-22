FROM node:6

WORKDIR /app/@webscale/order-client

# Install dependencies
ADD ./webscale-rest-client/package.json ./node_modules/@webscale/rest-client/
ADD ./webscale-rest-client-angular2/package.json ./node_modules/@webscale/rest-client-angular2/
ADD ./examples/order-client/package.json ./
RUN npm install

# Add build files
ADD ./examples/order-client/.angular-cli.json ./examples/order-client/tsconfig.json ./

CMD rm -rf ./dist/* && ./node_modules/.bin/ng serve --host 0.0.0.0 --poll 200
