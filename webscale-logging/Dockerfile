FROM node:6

WORKDIR /app/@webscale/logging

# Install dependencies
ADD ./webscale-logging/package.json ./
RUN npm install

# Add code
ADD ./webscale-logging/gulpfile.js ./webscale-logging/tsconfig.json ./

CMD rm -rf ./dist/* && ./node_modules/.bin/gulp watch
