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
ENV MONGO_HOTEL_SERVICE="mongodb+srv://hanslanda:halamadrid11@cluster0.zep2i0j.mongodb.net/hotel-service?retryWrites=true&w=majority"
ENV PORT=5001
ENV CLOUD_NAME="dyiedxbex"
ENV CLOUD_API_KEY=485699918953279
ENV CLOUD_API_SECRET="sn3jIUuHBthSTAlmS4T_4K_4gV8"
ENV JWT_SECRET="qBU4itbebGRi6AkKUw5WlyO3sSMLeqMd"
ENV JWT_LIFETIME=7d
ENV GOOGLE_APPLICATION_CREDENTIALS=./firebase/service-account.json
# For production
ENV BOOKING_PROD_URL="https://booking-api-j0fx.onrender.com/api/v1/bookings"
ENV AMQP_CLOUD=amqps://vhkhjnnq:mFaGBlcQW2UeSR_o0tyubSRRi_SrHRWo@rattlesnake.rmq.cloudamqp.com/vhkhjnnq

# Expose the port on which the app will run
EXPOSE 5001

# Command to run the application
CMD ["node", "index.js"]
