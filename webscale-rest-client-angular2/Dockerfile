FROM node:6

WORKDIR /app/@webscale/rest-client-angular2

# Install dependencies
ADD ./webscale-rest-client/package.json ./node_modules/@webscale/rest-client/
ADD ./webscale-rest-client-angular2/package.json ./
RUN npm install

# Add build files
ADD ./webscale-rest-client/gulpfile.js ./webscale-rest-client/tsconfig.json ./

CMD rm -rf ./dist/* && ./node_modules/.bin/gulp watch
