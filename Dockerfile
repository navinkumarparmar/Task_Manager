# 1. Base Image
FROM node:18

# 2. Working Directory inside Container
WORKDIR /app

# 3. Copy package.json and package-lock.json
COPY package*.json ./

# 4. Install Dependencies
RUN npm install

# 5. Copy Rest of the App Files
COPY . .

# 6. Build TypeScript Code
RUN npm run build

# 7. Expose the Port 
EXPOSE 3000

# 8. Command to Run the App
CMD ["npm", "run", "start"]
