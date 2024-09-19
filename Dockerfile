# Use Node.js LTS version
FROM node:14

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build TypeScript code
RUN npm run build

# Expose the port
EXPOSE 3000

# Start the app
CMD [ "node", "dist/index.js" ]
