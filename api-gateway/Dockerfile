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
ENV API_GATEWAY_PORT=5555
ENV NODE_ENV=production
# For production
ENV HOTEL_PROD_URL=http://localhost:5001/api/v1/hotels
ENV BOOKING_PROD_URL=https://localhost:5002/api/v1/bookings
# Expose the port on which the app will run
EXPOSE 5555

# Command to run the application
CMD ["node", "index.js"]
