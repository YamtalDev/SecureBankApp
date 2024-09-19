# Use Node.js LTS version
FROM node:14

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the port
EXPOSE 5000

# Start the app
CMD [ "npm", "run", "serve" ]
