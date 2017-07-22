FROM node:6

WORKDIR /app/@webscale/web

# Install dependencies
ADD ./webscale-web/package.json ./
RUN npm install

# Add code
ADD ./webscale-web/gulpfile.js ./webscale-web/tsconfig.json ./

CMD rm -rf ./dist/* && ./node_modules/.bin/gulp watch
