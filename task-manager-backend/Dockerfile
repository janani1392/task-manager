# 1. Use an official Node.js image as the base
FROM node:18

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of the application code
COPY . .

# 6. Copy the .env file to the container (to make sure the backend has the correct MongoDB URI)
COPY .env .env

# 7. Expose the port your app uses (5000 from .env)
EXPOSE 5000

# 8. Start the app
CMD ["npm", "start"]
