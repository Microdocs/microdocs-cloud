FROM node:6

WORKDIR /app/@webscale/rest-client

# Install dependencies
ADD ./webscale-rest-client/package.json ./
RUN npm install

# Add code
ADD ./webscale-rest-client/gulpfile.js ./webscale-rest-client/tsconfig.json ./

CMD rm -rf ./dist/* && ./node_modules/.bin/gulp watch
