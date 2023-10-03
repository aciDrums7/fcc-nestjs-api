# Use a base image that includes Node.js and yarn
FROM node:latest

# Set the working directory
WORKDIR /workspace

# Copy package.json and package-lock.json to the working directory
COPY package*.json yarn.lock ./

# Install dependencies using yarn
RUN yarn install

# Install TypeScript globally
RUN yarn global add typescript

# Install Git and other utilities
RUN apt-get update && apt-get install -y \
    git \
&& rm -rf /var/lib/apt/lists/*

# Install Nest CLI globally
RUN yarn global add @nestjs/cli

# Install Prisma CLI globally
RUN yarn global add prisma

# Copy the rest of your application code to the container
COPY . .

# Expose the port your Nest.js application listens on
EXPOSE 3333

# Define the command to start your Nest.js application
CMD ["yarn", "start"]
