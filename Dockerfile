# Base image
FROM node:20

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "start"]
