FROM node:6

WORKDIR /app/@microdocs/cloud-rest-client

# Install dependencies
ADD ./microdocs-cloud-rest-client/package.json ./
RUN npm install

# Add code
ADD ./microdocs-cloud-rest-client/gulpfile.js ./microdocs-cloud-rest-client/tsconfig.json ./

CMD rm -rf ./dist/* && ./node_modules/.bin/gulp watch
