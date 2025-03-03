FROM node:18

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the port your app will run on
EXPOSE ${FRONTEND_PORT}

# Start the application with node index.mjs
CMD ["node", "index.mjs"]