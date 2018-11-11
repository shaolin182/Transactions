# 1st stage, from NodeJS
FROM node:10-alpine as base

# Create app directory
WORKDIR /usr/src/app

# Create logs directory
RUN mkdir ./logs

# Create mount points for logs
VOLUME /usr/src/app/logs

# Copy package.json file here in order to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install --only=prod

# Bundle app source
COPY . .

# 2nd stage, code quality
FROM base as test

# Install dev dependencies
RUN npm install --only=dev

# Run code quality tools
RUN npm test
RUN npm run-script coverage
RUN npm run-script coverage-report

# 3rd stage, release
FROM base as release

# COPY test results in order to be used by jenkins
COPY --from=test /tmp /tmp

# Listen port
EXPOSE 8080

# Run app
ENTRYPOINT ["npm"]
CMD [ "start" ]
