# Use Node.js version 16 (with Alpine for a smaller image)
FROM node:22-alpine

# Set working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the entire source code into the container
COPY . .

# Compile TypeScript to JavaScript
RUN npx tsc

# Expose the service port (5000 in your case)
EXPOSE 5000

# Command to run the compiled JavaScript
CMD ["node", "dist/index.js"]
