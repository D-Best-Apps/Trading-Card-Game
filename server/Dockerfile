# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Clone your GitHub repository
RUN git clone https://github.com/D-Best-Apps/Trading-Card-Game.git .

# Install server dependencies and fix vulnerabilities
WORKDIR /usr/src/app/server
RUN npm install
RUN npm audit fix --force

# Build the client application and fix vulnerabilities
WORKDIR /usr/src/app/client
RUN npm install
RUN npm audit fix --force
RUN npm run build

# Return to the server directory for the final command
WORKDIR /usr/src/app/server

# Expose the port the app runs on
EXPOSE 5000

# Define the command to run the app
CMD ["node", "server.js"]