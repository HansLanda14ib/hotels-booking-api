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
ENV API_GATEWAY_PORT=3000
ENV NODE_ENV=production
# For production
HOTEL_PROD_URL=https://hotel-api-12oz.onrender.com/api/v1/hotels
BOOKING_PROD_URL=https://booking-api-j0fx.onrender.com/api/v1/bookings
# Expose the port on which the app will run
EXPOSE 5555

# Command to run the application
CMD ["node", "index.js"]
