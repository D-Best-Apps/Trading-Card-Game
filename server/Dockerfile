# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Install git, mysql-client, and netcat for the entrypoint script
RUN apk add --no-cache git mysql-client netcat-openbsd

# Set the working directory in the container
WORKDIR /Container

# Clone your GitHub repository into the current directory
RUN git clone https://github.com/D-Best-Apps/Trading-Card-Game.git .

# Copy the entrypoint script and make it executable
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

# DEBUG: List the contents of the directory to verify the clone
RUN ls -laR /Container

# Install server dependencies and fix vulnerabilities
WORKDIR /Container/server
RUN npm install

# Build the client application and fix vulnerabilities
WORKDIR /Container/client
RUN npm install

# Return to the server directory for the final command
WORKDIR /Container/server

# Set the entrypoint
ENTRYPOINT ["/Container/entrypoint.sh"]

# Define the command to run the app
CMD ["sh", "-c", "cd /Container/server && npm start & cd /Container/client && npm start & wait"]

