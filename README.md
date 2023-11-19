# Hotels Booking Web Application
This project is a web application for hotel bookings using a microservices architecture.

## Overview
The application comprises multiple services:

. Hotel Service: Built with Node.js and Express.js, utilizes MongoDB for its database.
. Auth Service: Utilizes Firebase for authentication and Firestore for the database.
. Booking Service: Another Node.js and Express.js service, interacting with a MongoDB database.
. Frontend: Developed using Angular.
. Architecture Diagram <!-- Placeholder for your architecture image -->

## Services
### Hotel Service
The Hotel Service handles hotel-related functionalities. It is developed using Node.js and Express.js, providing CRUD operations for hotels and interacts with a MongoDB database.

### Auth Service
The Auth Service manages authentication using Firebase authentication and Firestore as its database. It provides user authentication and management functionalities.

### Booking Service
The Booking Service is responsible for managing bookings. Similar to the Hotel Service, it is developed using Node.js, Express.js, and MongoDB, providing APIs for booking management.

### Frontend
The frontend is developed using Angular. It interacts with the services to provide a user-friendly interface for browsing hotels, making bookings, and managing user accounts.

## Prerequisites
Before running this application, ensure you have the following prerequisites installed and set up:
1. Node.js: Make sure you have Node.js installed on your machine. You can download it from here.

2. MongoDB: For running the MongoDB databases used by the Hotel Service and Booking Service, use MongoDB Cloud from here.
Go to : https://www.mongodb.com/cloud/atlas and click on Try Free then create an account
Click on Build a Cluster then choose a provider and a region then click on Create Cluster
Click on Database Access from the left menu then click on Add new database user
give a username and a password then click on Add user
Click on Network Access from the left menu then click on Add IP Address
click on Allow access from anywhere then click on Confirm
Click on Clusters from the left menu then click on Connect
choose Connect your application then copy the connection string and paste it in the .env file variable named MONGO_HOTEL_SERVICE in the hotel directory
do the same for the booking service and paste the connection string in the .env file variable named MONGO_BOOKING_SERVICE in the booking directory

3. Firebase Account:
Set up a Firebase account and project for the Auth Service. You can create a project through the Firebase Console. 
go to : https://console.firebase.google.com/
Click : Create a project and give a name to your project
disable : Google Analytics for this project then wait for the project to be created.
Click : Authentication from the left menu then click on Get Started
Click : Email/Password then click on Enable
back to the left menu and click on Project Overview
Click : Add app then choose web
give a name to your app then click on Register app
   - for frontend-app setting:
   copy the config object and paste it in the .env file in the frontend directory
   - configure firestore:
click on firestore from the left menu then click on Create database
choose Start in test mode then click on Enable
Click on pen icon to add a collection (name it users)
   - configure firebase for backend-app setting:
click on the gear icon next to Project Overview then click on Project settings
click on Service accounts then click on Generate new private key
copy the content of the downloaded file and paste in file named service-account.json in hotel/firebase directory


4. Angular CLI: If you plan to work on the frontend, you'll need Angular CLI. Install it globally using:
   npm install -g @angular/cli

## Installation and Setup
### On localhost
1. Create a .env file following the format specified in the `/api-gateway/env.example`,`/frontend/env.example`, `booking/env.example` and `hotel/env.example` directories, following the format specified in each microservice directory.
2. Install dependencies for root directory, hotel, booking, and api-gateway using `npm install`. and for frontend using `yarn install`.
3. if you want start all services at once, run `npm run start:all` from root directory.
4. if you want start each service separately, follow the instructions below:
First run `run npm install` in root directory, then:

#### Hotel Service:

Navigate to the hotel directory.
Run npm run hotelApp to start the hotel service.

#### Booking Service: (not working)

Navigate to the booking-service directory.
Run npm bookingApp to start the booking service.

#### Frontend: (REACT)

Navigate to the frontend directory.
npm start to start the frontend.

#### api-gateway:
Navigate to the api-gateway directory.
Run npm run start to start the api-gateway.
##### Note: You need to start all services before starting the api-gateway.
###### more details about api-gateway :
http://localhost:5555/hotel : redirect to hotel service (equivalent to http://localhost:5001/api/v1)
http://localhost:5555/booking : redirect to booking service (equivalent to http://localhost:5002/api/v1)
## Contributions and Issues
Contributions and suggestions are welcome. If you encounter any issues or have ideas for improvements, please open an issue in this repository.


