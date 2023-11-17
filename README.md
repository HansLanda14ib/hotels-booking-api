A microservice sample for building an Hotels Booking backend.
## Software Architecture
- The application uses an API gateway to bind all services along a single front, acting as a proxy for the domains in which the `auth`, `booking` and `hotel` microservices
## Prerequisites
Have npm and Node.js on your machine
Set up your own MongoDB collection with appropriate security/credential settings

### On localhost
1. Create a .env file following the format specified in the `/auth/env.example`, `booking/env.example` and `hotel/env.example` directories, following the format specified in each microservice directory
2. Run `npm install` in the `/auth`, `/hotel`, `/booking` and `/api-gateway` directories
3. Run `npm start` on all four directories mentioned in the step above. Now you can test the APIs from localhost:5003
4. 