FROM node:6

WORKDIR /app/@webscale/events

# Install dependencies
ADD ./webscale-events/package.json ./
RUN npm install

# Add code
ADD ./webscale-events/gulpfile.js ./webscale-events/tsconfig.json ./

CMD rm -rf ./dist/* && ./node_modules/.bin/gulp watch
