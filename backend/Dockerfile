FROM node:18

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Copy the wait-for-it script and make it executable
COPY wait-for-it.sh /usr/local/bin/wait-for-it.sh
RUN chmod +x /usr/local/bin/wait-for-it.sh

# Expose the port specified by the environment variable (or default)
EXPOSE ${BACKEND_PORT}

# Start the app after waiting for the MySQL service
CMD ["sh", "-c", "wait-for-it.sh ${DB_HOST}:${DB_PORT} --timeout=30 -- node index.mjs"]
