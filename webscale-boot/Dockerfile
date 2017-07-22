FROM node:6

WORKDIR /app/@webscale/boot

# Install dependencies
ADD ./webscale-boot/package.json ./
RUN npm install

# Add code
ADD ./webscale-boot/gulpfile.js ./webscale-boot/tsconfig.json ./

CMD rm -rf ./dist/* && ./node_modules/.bin/gulp watch
