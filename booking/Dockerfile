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
ENV MONGO_BOOKING_SERVICE="mongodb+srv://hanslanda:halamadrid11@cluster0.zep2i0j.mongodb.net/booking-service?retryWrites=true&w=majority"
ENV PORT=5002
ENV GOOGLE_APPLICATION_CREDENTIALS=./firebase/service-account.json
ENV HOTEL_API_SECRET="qBU4itbebGRi6AkKUw5WlyO3sSMLeqMd"
ENV STRIPE_KEY="sk_test_51NzdlDEz26lIMCWwbTT8yCGN6TMilx6eMFI1x0OALIAeypEJ515awJTxnv5a3OWzitp2XQjkGFSMsjkr9c0IqbFq00p70pI65W"

# Expose the port on which the app will run
EXPOSE 5002

# Command to run the application
CMD ["node", "index.js"]
