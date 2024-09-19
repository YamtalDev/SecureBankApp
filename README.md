# Secure Web Banking Application

[![Node.js Version](https://img.shields.io/badge/Node.js-v22.9.0-339933.svg?logo=nodedotjs&style=flat)](https://nodejs.org/en/)
[![TypeScript Version](https://img.shields.io/badge/TypeScript-v5.6.2-3178C6.svg?logo=typescript&style=flat)](https://www.typescriptlang.org/)
[![Express.js Version](https://img.shields.io/badge/Express.js-v4.21.0-000000.svg?logo=express&style=flat)](https://expressjs.com/)

<br>

[![MongoDB Version](https://img.shields.io/badge/MongoDB-v7.0.14-47A248.svg?logo=mongodb&style=flat)](https://www.mongodb.com/)
[![AWS](https://img.shields.io/badge/AWS-Cloud-FF9900.svg?logo=amazonaws&style=flat)](https://aws.amazon.com/)
[![Swagger](https://img.shields.io/badge/Swagger-API-85EA2D.svg?logo=swagger&style=flat)](https://swagger.io/)
[![Twilio](https://img.shields.io/badge/Twilio-API-F22F46.svg?logo=twilio&style=flat)](https://www.twilio.com/)

<br>

[![npm Version](https://img.shields.io/badge/npm-v10.8.3-CB3837.svg?logo=npm&style=flat)](https://www.npmjs.com/)
[![Angular CLI Version](https://img.shields.io/badge/Angular_CLI-v18.2.4-DD0031.svg?logo=angular&style=flat)](https://angular.io/)
[![Docker Version](https://img.shields.io/badge/Docker-v24.0.7-2496ED.svg?logo=docker&style=flat)](https://www.docker.com/)
[![Minikube Version](https://img.shields.io/badge/Minikube-v1.34.0-326CE5.svg?logo=kubernetes&style=flat)](https://minikube.sigs.k8s.io/docs/)
[![kubectl Version](https://img.shields.io/badge/kubectl-v1.31.0-326CE5.svg?logo=kubernetes&style=flat)](https://kubernetes.io/docs/reference/kubectl/)

<br>

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-0.0.1-blue.svg)](https://github.com/YourUsername/SecureWebBankingApp)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)


## Project Overview

The Secure Web Banking Application is a web-based system that allows users to sign up, verify their phone number via SMS, log in, view their account balance, view recent transactions, and send money to other registered users. The application adheres to industry best practices, utilizing modern technologies and frameworks to ensure security, scalability, and maintainability.

## Requirements

1. **User Authentication and Authorization:**

   - Sign-up with email, password, and phone number.
   - Phone number verification using a one-time passcode (OTP) sent via SMS.
   - Secure sign-in with JWT authentication.
   - Protected dashboard accessible only after authentication.

2. **Transactions:**

   - View account balance (randomly assigned upon sign-up for demo purposes).
   - View recent transactions.
   - Send money to other registered users by email.
   - Validate sufficient balance and recipient existence before processing transactions.

3. **Technology Stack:**

   - **Frontend:** [Angular](https://angular.io/) with [TypeScript](https://www.typescriptlang.org/).
   - **Backend:** [Node.js](https://nodejs.org/en/) with [Express.js](https://expressjs.com/).
   - **Database:** [MongoDB](https://www.mongodb.com/).
   - **SMS Service:** [Twilio](https://www.twilio.com/) (or a free alternative).
   - **API Documentation:** [Swagger](https://swagger.io/).
   - **Containerization:** [Docker](https://www.docker.com/).
   - **Orchestration:** [Kubernetes](https://kubernetes.io/) for microservices.
   - **Deployment:** AWS (Amazon Web Services) with local deployment via Docker Compose.

4. **Additional Tools:**

   - **UI Design:** [Figma](https://www.figma.com/) for implementing the provided designs.
   - **Version Control:** [Git](https://git-scm.com/).

## Main Entities

**User:**

Attributes:

- `userId`: Unique identifier for each user.
- `email`: User's email address.
- `password`: Hashed password for authentication.
- `phoneNumber`: User's phone number.
- `isVerified`: Boolean indicating if the phone number has been verified.
- `balance`: Current account balance.
- `createdAt`: Timestamp when the account was created.

**Transaction:**

Attributes:

- `transactionId`: Unique identifier for each transaction.
- `senderEmail`: Email address of the sender.
- `receiverEmail`: Email address of the receiver.
- `amount`: Amount of money transferred.
- `timestamp`: Timestamp when the transaction occurred.
- `type`: Indicates 'credit' or 'debit'.

**OTP Verification:**

Attributes:

- `email`: Email address associated with the OTP.
- `otpCode`: One-time passcode sent to the user's phone.
- `expiresAt`: Expiration time of the OTP.

## Features

- **User Registration and Verification:**

  - Users can sign up with email, password, and phone number.
  - Phone number verification via OTP sent through SMS.
  - Validation to prevent duplicate registrations with the same email.

- **Secure Authentication:**

  - Passwords stored securely using hashing (e.g., bcrypt).
  - JWT used for session management and route protection.

- **User Dashboard:**

  - Displays account balance and recent transactions.
  - Provides an option to sign out.

- **Money Transfer:**

  - Users can send money to other registered users.
  - Validates recipient's existence and sufficient sender balance.
  - Updates transaction history for both sender and receiver.

- **API Documentation:**

  - APIs documented using Swagger for easy integration and testing.

- **Containerization and Deployment:**

  - Dockerized services for consistent environment setup.
  - Kubernetes used for orchestrating microservices.
  - AWS used for deployment with an option for local deployment using Docker Compose.

- **Industry Best Practices:**

  - Clean code with proper architecture.
  - Secure coding practices to protect sensitive data.
  - Use of environment variables for configuration.

<br>

<p align="center">
  <img src="./art/architecture_diagram.png" alt="Architecture Diagram">
</p>

<br>



# Usage

To utilize this web banking application, follow these steps:

### Prerequisites

Before you begin, ensure you have the following prerequisites installed on your system:

- **Node.js and npm:** If you don't have Node.js installed, you can download it from the official website:

  - [Download Node.js](https://nodejs.org/en/download/)

- **Angular CLI:** Install Angular CLI globally using npm:

  ```shell
  npm install -g @angular/cli
  
  ```

- **MongoDB:** Ensure you have MongoDB installed and running on your system.

  - [Download MongoDB](https://www.mongodb.com/try/download/community)

- **Docker and Docker Compose:** If you prefer to run the project using Docker containers, make sure you have Docker and Docker Compose installed.

  - [Download Docker](https://docs.docker.com/get-started/get-docker/)
  - [Download Docker Compose](https://docs.docker.com/compose/install/)


- **AWS CLI (Optional):** For deployment to AWS.

  - [Install AWS CLI](https://aws.amazon.com/cli/)

### You can choose to run the project natively or with Docker, depending on your preference and system configuration.


# Installation
## Clone or Download the Repository

You can clone this Git repository or download it as a ZIP file to your local machine.

```shell 
git clone https://github.com/YamtalDev/SecureBankApp.git
cd SecureBankApp

```
Backend Setup
1. Navigate to the Backend Directory:

```shell 
cd backend

```

2. Install Dependencies:

```shell 
npm install

```

3. Environment Variables:
Create a `.env` file in the `backend` directory and add the following configurations:

```shell 

PORT=3000
MONGODB_URI=mongodb://localhost:27017/bankapp
JWT_SECRET=your_jwt_secret_key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

```

 - Replace your_jwt_secret_key with a secure key.
 - For Twilio configurations, if you're using Twilio's free trial, replace the placeholders with your actual account details.

 4. Run the Backend Server:

```shell 
npm start
```

 - The backend server should now be running on `http://localhost:3000`.


# Frontend Setup
1. Navigate to the Frontend Directory:

```shell
cd ../frontend
```

2. Install Dependencies:

```shell
npm install

```

3. Environment Variables:

Create an `environment.ts` file in the `src/environments` directory with the following content:

``` typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

4. Run the Frontend Server:

``` shell
ng serve

```

 - The frontend application should now be running on `http://localhost:4200`.


# MongoDB Setup
Ensure that MongoDB is running on your local machine. If installed locally, you can start it with:

```shell
mongod
```

Alternatively, you can use MongoDB Atlas for a cloud-hosted database. Update `MONGODB_URI` in the `.env` file accordingly.

# Spin Up with Docker
1. Ensure No Services Are Running on Required Ports:

```shell
sudo lsof -i :3000
sudo lsof -i :4200
sudo lsof -i :27017
```

 - Kill any processes using these ports if necessary.

2. Navigate to the Root Directory:

```shell
cd ../
```

3. Run Docker Containers:


```shell
docker-compose up --build
```

 - This command builds and starts all services defined in the `docker-compose.yml` file.

4. Access the Application:

 - Frontend: [http://localhost:4200](http://localhost:4200)
 - Backend API: [http://localhost:3000/api](http://localhost:3000/api)

 # API Documentation

API documentation is available via Swagger UI:
 - [Access Swagger UI](http://localhost:3000/api-docs)

 - This provides a detailed overview of all API endpoints, request and response schemas, and allows for interactive testing. 
 
# Features and Endpoints

1. User Registration

 - Endpoint:

``` http
POST /api/auth/register
```

 - Request Body:

```json
{
  "email": "user@example.com",
  "password": "YourSecurePassword",
  "phoneNumber": "+1234567890"
}
```

 - Response:

 - Success message indicating that an OTP has been sent to the provided phone number.

2. Phone Verification

 - Endpoint:

``` http
POST /api/auth/verify-phone
```

 - Request Body:

```json
{
  "email": "user@example.com",
  "otpCode": "123456"
}
```

- Response:

 - Success message indicating that the phone number has been verified.

3. User Login
 - Endpoint:

``` http
POST /api/auth/login
```

 - Request Body:

```json
{
  "email": "user@example.com",
  "password": "YourSecurePassword"
}
```

 - Response:

 - JWT token to be used for authenticated requests.

4. Get User Dashboard
 - Endpoint:

``` http

GET /api/user/dashboard
```

 - Headers:

 * Authorization: Bearer <JWT_TOKEN>

 - Response:

```json
{
  "email": "user@example.com",
  "balance": 1000,
  "transactions": [
    {
      "transactionId": "txn_123",
      "senderEmail": "user@example.com",
      "receiverEmail": "receiver@example.com",
      "amount": -100,
      "timestamp": "2023-09-01T12:34:56Z",
      "type": "debit"
    }
  ]
}
```

5. Send Money

 - Endpoint:

``` http
POST /api/transactions/send
```

 - Headers:

 * Authorization: Bearer <JWT_TOKEN>

 - Request Body:

```json
{
  "receiverEmail": "receiver@example.com",
  "amount": 100
}
```

 - Response:

 * Success message with transaction details.

6. Sign Out

 - Endpoint:

 * Frontend handles sign-out by removing JWT token from storage.



# Deployment to AWS (Optional)
Given the budget constraints, you can utilize AWS Free Tier services.

1. Set Up AWS Account:

 - Sign up for AWS and configure IAM users and roles.
2. Deploy Backend and Frontend:

 - Use AWS Elastic Beanstalk or AWS EC2 instances to deploy your Docker containers.
 - Alternatively, use AWS Elastic Container Service (ECS) with Fargate.

3. Database Deployment:
 - Use Amazon DocumentDB (MongoDB compatible) within the free tier limits.
 - Ensure security groups and network settings allow your application to connect to the database.

4. SMS Service Configuration:

 - If Twilio's free trial is insufficient, consider using AWS SNS (Simple Notification Service) for sending SMS messages within the free tier.

# Testing
 - Unit Tests:
 * Implement unit tests using frameworks like Jest for backend and Jasmine/Karma for frontend.
 - Integration Tests:
 *  Test interactions between different components of the application.
 - Manual Testing:
 * Use tools like Postman to test API endpoints.

Learning Resources

[![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io/docs)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://docs.mongodb.com/manual/tutorial/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docs.docker.com/get-started/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)](https://kubernetes.io/docs/tutorials/kubernetes-basics/)
[![AWS](https://img.shields.io/badge/AWS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)](https://aws.amazon.com/free/)
[![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](https://swagger.io/docs/)
[![Twilio](https://img.shields.io/badge/Twilio-F22F46?style=for-the-badge&logo=twilio&logoColor=white)](https://www.twilio.com/docs/usage/api)


## License:
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact:
For questions or issues, feel free to [create an issue](https://github.com/YamtalDev/HackerNews-API/issues) or contact the project maintainer.