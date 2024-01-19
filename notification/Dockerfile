# Use an official Node.js runtime as a base image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the application code to the container
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5005
ENV AMQP_CLOUD=amqps://vhkhjnnq:mFaGBlcQW2UeSR_o0tyubSRRi_SrHRWo@rattlesnake.rmq.cloudamqp.com/vhkhjnnq

# Expose the port on which the app will run
EXPOSE 5005

# Command to run the application
CMD ["node", "index.js"]
