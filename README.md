# User API Documentation

Welcome to the User API documentation. This API allows you to manage users within your application, including user registration, authentication, fetching user details, and updating user information.

## Authentication

Authentication in this API is handled using JSON Web Tokens (JWT). When making requests to endpoints that require authentication, you need to include a valid JWT token in the request headers.

## Endpoints

### Registration

- **URL:** `/api/registration`
- **Method:** `POST`
- **Description:** Register a new user with the provided information.
- **Parameters:**
  - `name`: User's name (required)
  - `email`: User's email address (required, must be unique)
  - `password`: User's password (required)
- **Response:** Returns a success message if registration is successful. If there are any errors (e.g., duplicate email), appropriate error messages are returned.

### Login

- **URL:** `/api/loginUser`
- **Method:** `POST`
- **Description:** Log in an existing user with the provided credentials.
- **Parameters:**
  - `email`: User's email address (required)
  - `password`: User's password (required)
- **Response:** Returns a JWT token upon successful login, which can be used for authentication in subsequent requests. If login fails (e.g., invalid credentials), appropriate error messages are returned.

### Get User by ID

- **URL:** `/api/user/:id`
- **Method:** `GET`
- **Description:** Fetch details of a specific user by their ID.
- **Parameters:**
  - `id`: User ID (required)
- **Response:** Returns user details (excluding password) if found. If no user is found with the provided ID, a not found error message is returned.

### Update User

- **URL:** `/api/user/:id`
- **Method:** `PUT`
- **Description:** Update details of a specific user by their ID.
- **Parameters:**
  - `id`: User ID (required)
  - `name`: Updated name
  - `country`: Updated country
  - `image`: Updated image URL
- **Response:** Returns updated user details (excluding password) if the update is successful. If no user is found with the provided ID, a not found error message is returned.

### Change User Account Type

- **URL:** `/api/changeUserType/:id`
- **Method:** `PUT`
- **Description:** Change the account type (private/public) of a specific user by their ID.
- **Parameters:**
  - `id`: User ID (required)
- **Response:** Returns a success message indicating the account type change. If no user is found with the provided ID, a not found error message is returned.

### Get All Users

- **URL:** `/api/users`
- **Method:** `GET`
- **Description:** Fetch details of all non-private users.
- **Response:** Returns an array of user objects (excluding sensitive fields like password and token).

### Get All Users (Admin)

- **URL:** `/api/usersAdmin`
- **Method:** `GET`
- **Description:** Fetch details of all users (for admin use only).
- **Response:** Returns an array of user objects (excluding sensitive fields like password and token).

## Models

### User

The User model represents a user in the system. It includes the following fields:

- `name`: User's name
- `email`: User's email address
- `password`: User's password (hashed)
- `image`: URL to user's profile image
- `country`: User's country
- `bio`: User's biography
- `phone`: User's phone number
- `timeZone`: User's time zone
- `role`: User's role (default: "user")
- `googlekey`: Google key for social login
- `token`: JWT token for authentication
- `isActive`: User's account activation status
- `isPrivate`: User's account privacy setting
- `createdAt`: Timestamp of user creation
- `updatedAt`: Timestamp of last user update
- `lastlogin`: Timestamp of user's last login

## Controllers

The controllers folder contains the implementation of user-related API functions. These functions handle the business logic for user registration, login, fetching users, updating user details, and changing user account type. Error handling and response formatting are also implemented in the controllers.

## Middleware

The middleware folder contains the authentication middleware (`authJWT.js`). This middleware verifies JWT tokens for protected routes and ensures that only authenticated users can access certain endpoints.
