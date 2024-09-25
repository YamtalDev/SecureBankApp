# User Micro Service

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-0.0.1-blue.svg)](https://github.com/YourUsername/SecureWebBankingApp)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)  
[![Node.js Version](https://img.shields.io/badge/Node.js-v22.9.0-339933.svg?logo=nodedotjs&style=flat)](https://nodejs.org/en/)
[![TypeScript Version](https://img.shields.io/badge/TypeScript-v5.6.2-3178C6.svg?logo=typescript&style=flat)](https://www.typescriptlang.org/)
[![Express.js Version](https://img.shields.io/badge/Express.js-v4.21.0-000000.svg?logo=express&style=flat)](https://expressjs.com/)  
[![MongoDB Version](https://img.shields.io/badge/MongoDB-v7.0.14-47A248.svg?logo=mongodb&style=flat)](https://www.mongodb.com/)
[![Joi Version](https://img.shields.io/badge/Joi-v17.6.0-2F9331.svg?logo=javascript&style=flat)](https://github.com/sideway/joi)
[![Mongoose Version](https://img.shields.io/badge/Mongoose-v7.0.0-880000.svg?logo=mongoose&style=flat)](https://mongoosejs.com/)
[![bcrypt Version](https://img.shields.io/badge/bcrypt-v5.1.0-3382ed.svg?logo=lock&style=flat)](https://github.com/kelektiv/node.bcrypt.js)
[![Helmet Version](https://img.shields.io/badge/Helmet-v6.0.0-8c8c8c.svg?logo=helmet&style=flat)](https://helmetjs.github.io/)
[![Cors Version](https://img.shields.io/badge/Cors-v2.8.5-00a3e0.svg?logo=shield&style=flat)](https://github.com/expressjs/cors)
[![Express Validator Version](https://img.shields.io/badge/express--validator-v6.14.0-6e6e6e.svg?logo=validator&style=flat)](https://express-validator.github.io/docs/)
[![Winston Version](https://img.shields.io/badge/Winston-v3.8.2-000000.svg?logo=winston&style=flat)](https://github.com/winstonjs/winston)
[![Jest Version](https://img.shields.io/badge/Jest-v29.6.1-C21325.svg?logo=jest&style=flat)](https://jestjs.io/)
[![Supertest Version](https://img.shields.io/badge/Supertest-v6.3.3-000000.svg?logo=supertest&style=flat)](https://github.com/visionmedia/supertest)
[![Dotenv Version](https://img.shields.io/badge/Dotenv-v16.3.1-ECD53F.svg?logo=dotenv&style=flat)](https://github.com/motdotla/dotenv)
[![Express Rate Limit Version](https://img.shields.io/badge/express--rate--limit-v6.7.0-8c8c8c.svg?logo=express&style=flat)](https://github.com/nfriedly/express-rate-limit)
[![Http-Errors Version](https://img.shields.io/badge/http--errors-v2.0.0-FF6347.svg)](https://github.com/jshttp/http-errors)
[![Express.js Version](https://img.shields.io/badge/Express.js-v4.21.0-000000.svg?logo=express&style=flat)](https://expressjs.com/)



## Service Overview
This is a Node.js and TypeScript-based microservice for user registration in a banking application. It provides a RESTful API for creating, retrieving, updating, and deleting user accounts, as well as updating user balances.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Cloning the Repository](#cloning-the-repository)
  - [Installing Dependencies](#installing-dependencies)
- [Configuration](#configuration)
- [Running the Service](#running-the-service)
- [Testing](#testing)
- [API Documentation](#api-documentation)
  - [Endpoints](#endpoints)
    - [Create a User](#create-a-user)
    - [Get All Users](#get-all-users)
    - [Get User by ID](#get-user-by-id)
    - [Update User](#update-user)
    - [Delete User](#delete-user)
    - [Update User Balance](#update-user-balance)
- [Tools and Technologies Used](#tools-and-technologies-used)
- [Deployment with Docker and Docker Compose](#deployment-with-docker-and-docker-compose)
- [Infrastructure](#infrastructure)
- [Additional Resources](#additional-resources)

## Prerequisites

- **Node.js** (version 14.x or higher)
- **npm** (version 6.x or higher)
- **MongoDB** (running instance)
- **Git** (for cloning the repository)
- **Docker** (optional, for containerization)
- **Docker Compose** (optional, for orchestrating containers)



## Design

<br>

<p align="center">
  <img src="../../design/diagram.png" alt="Architecture Diagram">
</p>

<br>


## Installation

### Cloning the Repository

```bash
git clone https://github.com/YamtalDev/SecureBankApp.git
cd SecureBankApp/server/user

```

### Installing Dependencies

Install the required npm packages:

```bash
npm install
```

## Configuration

Create a `.env` file in the root directory and add the following environment variables:

```dotenv
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/users
```

You can adjust the values as needed for your environment.

## Running the Service

To start the service in development mode:

```bash
npm run dev
```

This script typically uses `nodemon` for hot reloading during development.

To start the service in production mode:

```bash
npm start
```

This script compiles the TypeScript code and runs the compiled JavaScript using `node`.

## Testing

To run unit and integration tests:

```bash
npm test
```

To generate a test coverage report:

```bash
npm run coverage
```

## API Documentation

The service exposes a RESTful API at `https://localhost:5000/api/users`. All responses are in JSON format.

### Endpoints

#### Create a User

- **URL:** `/api/users`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **Body:**

  ```json
  {
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "phoneNumber": "+1234567890"
  }
  ```

- **Success Response:**
  - **Code:** `201 Created`
  - **Content:**

    ```json
    {
      "message": "User created successfully.",
      "user": {
        "id": "60f7c0e2b4d3c827d8f0e8b1",
        "email": "user@example.com",
        "phoneNumber": "+1234567890",
        "isVerified": false,
        "balance": 0
      }
    }
    ```

#### Get All Users

- **URL:** `/api/users`
- **Method:** `GET`
- **Success Response:**
  - **Code:** `200 OK`
  - **Content:**

    ```json
    {
      "users": [
        {
          "id": "60f7c0e2b4d3c827d8f0e8b1",
          "email": "user@example.com",
          "phoneNumber": "+1234567890",
          "isVerified": false,
          "balance": 0
        },
        {
          "id": "60f7c1a3b4d3c827d8f0e8b2",
          "email": "anotheruser@example.com",
          "phoneNumber": "+0987654321",
          "isVerified": true,
          "balance": 100
        }
      ]
    }
    ```

#### Get User by ID

- **URL:** `/api/users/:id`
- **Method:** `GET`
- **URL Params:**
  - `id` - The ID of the user.
- **Success Response:**
  - **Code:** `200 OK`
  - **Content:**

    ```json
    {
      "user": {
        "id": "60f7c0e2b4d3c827d8f0e8b1",
        "email": "user@example.com",
        "phoneNumber": "+1234567890",
        "isVerified": false,
        "balance": 0
      }
    }
    ```

#### Update User

- **URL:** `/api/users/:id`
- **Method:** `PUT`
- **Headers:** `Content-Type: application/json`
- **URL Params:**
  - `id` - The ID of the user.
- **Body:** (Include only the fields you wish to update)

  ```json
  {
    "email": "newemail@example.com",
    "password": "NewSecurePassword456!",
    "phoneNumber": "+1122334455"
  }
  ```

- **Success Response:**
  - **Code:** `200 OK`
  - **Content:**

    ```json
    {
      "message": "User updated successfully.",
      "user": {
        "id": "60f7c0e2b4d3c827d8f0e8b1",
        "email": "newemail@example.com",
        "phoneNumber": "+1122334455",
        "isVerified": false,
        "balance": 0
      }
    }
    ```

#### Delete User

- **URL:** `/api/users/:id`
- **Method:** `DELETE`
- **URL Params:**
  - `id` - The ID of the user.
- **Success Response:**
  - **Code:** `200 OK`
  - **Content:**

    ```json
    {
      "message": "User deleted successfully."
    }
    ```

#### Update User Balance

- **URL:** `/api/users/:id`
- **Method:** `PATCH`
- **Headers:** `Content-Type: application/json`
- **URL Params:**
  - `id` - The ID of the user.
- **Body:**

  ```json
  {
    "amount": 50
  }
  ```

  - To increase the balance by 50 units.
  - Use a negative number to decrease the balance.

- **Success Response:**
  - **Code:** `200 OK`
  - **Content:**

    ```json
    {
      "message": "Balance updated successfully.",
      "user": {
        "id": "60f7c0e2b4d3c827d8f0e8b1",
        "email": "user@example.com",
        "phoneNumber": "+1234567890",
        "isVerified": false,
        "balance": 50
      }
    }
    ```

## Deployment with Docker and Docker Compose

### Building the Docker Image

Ensure Docker is installed and running on your machine.

1. **Build the Docker image:**

   ```bash
   docker build .
   ```

2. **Run the Docker container:**

   ```bash
   docker run -p 5000:5000 --env-file .env user
   ```

### Using Docker Compose

A `docker-compose.yml` file is provided to run the service along with a MongoDB instance.

1. **Run Docker Compose:**

   ```bash
   docker-compose up --build
   ```

   This command builds the Docker images and starts the containers.

## Infrastructure

The service is designed with the following infrastructure components:

- **Express.js Server**: Handles HTTP requests and routes.
- **MongoDB Database**: Stores user data securely.
- **SSL/TLS**: Uses HTTPS for secure communication.
- **Middleware**:
  - **Validation**: Validates incoming request data.
  - **Security**: Applies security best practices using Helmet and Cors.
  - **Error Handling**: Centralized error handling for consistent responses.
  - **Rate Limiting**: Prevents abuse by limiting the number of requests.
- **Logging**: Uses Winston for logging important events and errors.
- **Testing**: Includes unit and integration tests to ensure reliability.
- **Docker**: Containerization for consistent deployment environments.
- **Docker Compose**: Orchestrates multi-container setups (e.g., service and database).

---

For any questions or support, please contact [your.email@example.com](mailto:your.email@example.com).

---