FROM node:6

WORKDIR /app/@microdocs/cloud-rest-client-angular2

# Install dependencies
ADD ./microdocs-cloud-rest-client/package.json ./node_modules/@microdocs/cloud-rest-client/
ADD ./microdocs-cloud-rest-client-angular2/package.json ./
RUN npm install

# Add build files
ADD ./microdocs-cloud-rest-client/gulpfile.js ./microdocs-cloud-rest-client/tsconfig.json ./

CMD rm -rf ./dist/* && ./node_modules/.bin/gulp watch
