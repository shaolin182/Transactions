# From NodeJS Version 9
FROM node:9

# Create app directory
WORKDIR /usr/src/app

# Create logs directory
RUN mkdir ./logs

# Create mount points for source code and modules
VOLUME /usr/src/app/src
VOLUME /usr/src/app/logs

# Copy package.json file here in order to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Bundle app source
COPY . .

# Listen port
EXPOSE 8080

# Run app
CMD [ "npm", "start" ]
