FROM node:6

WORKDIR /app/@webscale/auditlog

# Install dependencies
ADD ./webscale-auditlog/package.json ./
RUN npm install

# Add code
ADD ./webscale-auditlog/gulpfile.js ./webscale-auditlog/gulpfile.ts ./webscale-auditlog/tsconfig.json ./

CMD ./node_modules/.bin/gulp watch
