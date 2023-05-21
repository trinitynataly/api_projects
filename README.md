# Portfolio API Server

This is a Node.js application that serves as a server for a portfolio website's API. It uses the Express framework for routing, Mongoose for working with MongoDB databases, CORS for enabling cross-origin resource sharing, body-parser for parsing HTTP request bodies, and Winston for logging application events.

## Requirements

- Node.js
- MongoDB

## Installation

1. Clone the repository.
2. Run `npm install` to install the project's dependencies.

## Configuration

1. Create a `.env` file in the project's root directory.
2. Set the `MONGODB_URI` environment variable to the URI of your MongoDB server.
3. Set the `MONGODB_DBNAME` environment variable to the name of the MongoDB database to connect to.
4. Set the `PORT` environment variable to the port number that the application should listen on.
5. Set the `JWT_SECRET` environment variable to the secret key for generating JSON Web Tokens (JWTs)
6. Set the `JWT_REFRESH_SECRET` environment variable to the secret key for generating JWT refresh tokensnode src/app.js

## Usage

1. Run `node src/app.js` to start the application.
2. The server will be accessible at `http://localhost:<port>/api`.

## Project Structure

The project's main file is located at `src/app.js`. This file contains the application's helpers, routes, and logging configuration. The API routes are defined in `src/routes/routes.js`. Static files such as images, stylesheets, and JavaScript files are located in the `public` directory.

## API Documentation

### Authentication Module

This module handles user authentication and authorization. It uses JSON Web Tokens (JWTs) to authenticate users and protect routes. After a user logs in, they are given an access token and a refresh token. The access token is used to access protected routes, and the refresh token can be used to refresh the access token when it expires.

Base URL: `/api/auth`

#### Endpoints

##### Login

- **URL:** `/login`
- **Method:** POST
- **Description:** Authenticate user credentials and generate access and refresh tokens.
- **Parameters:**
  - `email` (string): Email of the user.
  - `password` (string): Password of the user.
- **Example Request:**

  ```http
  POST /api/auth/login HTTP/1.1
  Host: example.com
  Content-Type: application/json

  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

- **Example Response:**
  ```json
  {
    "access_token": "<access_token>",
    "refresh_token": "<refresh_token>",
    "user": {
      "_id": "XXXXXXXXXXXX",
      "name": "John Doe",
      "email": "user@example.com",
      "createdAt": "2021-01-01T00:00:00.000Z"
    }
  }
  ```

##### Refresh Token

- **URL:** `/refresh`
- **Method:** POST
- **Description:** Refresh the access token using a valid refresh token.
- **Parameters:**
  - `refresh_token` (string): Refresh token obtained during login.
- **Example Request:**

  ```http
  POST /api/auth/refresh HTTP/1.1
  Host: example.com
  Content-Type: application/json

  {
    "refresh_token": "<refresh_token>"
  }
  ```

- **Example Response:**
  ```json
  {
    "access_token": "<new_access_token>"
  }
  ```

### Users Module

This module handles user management. It allows users to be retrieved, created, updated, and deleted. All routes in this module are protected and require a valid JWT token to access.

Base URL: `/api/users`

#### Endpoints

##### Retrieve All Users

- **URL:** `/`
- **Method:** GET
- **Description:** Retrieve all users from the database.
- **Authentication:** JWT token required.
- **Example Request:**
  ```http
  GET /api/users HTTP/1.1
  Host: example.com
  Authorization: Bearer <JWT token>
  ```
- **Example Response:**
  ```json
  [
    {
      "_id": "XXXXXXXXXXX0",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2021-01-01T00:00:00.000Z"
    },
    {
      "_id": "XXXXXXXXXXX1",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "createdAt": "2021-01-01T00:00:00.000Z"
    }
  ]
  ```

##### Retrieve a Specific User

- **URL:** `/:id`
- **Method:** GET
- **Description:** Retrieve a specific user by ID from the database.
- **Parameters:**
  - `id` (path parameter): ID of the user to retrieve.
- **Authentication:** JWT token required.
- **Example Request:**
  ```http
  GET /api/users/XXXXXXXXXXXX1 HTTP/1.1
  Host: example.com
  Authorization: Bearer <JWT token>
  ```
- **Example Response:**
  ```json
  {
    "_id": "XXXXXXXXXXXX1",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2021-01-01T00:00:00.000Z"
  }
  ```

##### Create a New User

- **URL:** `/`
- **Method:** POST
- **Description:** Create a new user in the database.
- **Parameters:**
  - `name` (string): Name of the user.
  - `email` (string): Email of the user.
  - `password` (string): Password of the user.
- **Authentication:** JWT token required.
- **Example Request:**

  ```http
  POST /api/users HTTP/1.1
  Host: example.com
  Authorization: Bearer <JWT token>
  Content-Type: application/json

  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- **Example Response:**
  ```json
  {
    "_id": "3",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2021-01-01T00:00:00.000Z"
  }
  ```

##### Update a User

- **URL:** `/:id`
- **Method:** PUT
- **Description:** Update a specific user by ID in the database.
- **Parameters:**
  - `id` (path parameter): ID of the user to update.
  - `name` (string): Updated name of the user.
  - `email` (string): Updated email of the user.
  - `password` (string): Updated password of the user.
- **Authentication:** JWT token required.
- **Example Request:**

  ```http
  PUT /api/users/XXXXXXXXXXXX3 HTTP/1.1
  Host: example.com
  Authorization: Bearer <JWT token>
  Content-Type: application/json

  {
    "name": "John Smith",
    "email": "john@example.com",
    "password": "newpassword123"
  }
  ```

- **Example Response:**
  ```json
  {
    "_id": "XXXXXXXXXXXX3",
    "name": "John Smith",
    "email": "john@example.com",
    "createdAt": "2021-01-01T00:00:00.000Z"
  }
  ```

##### Delete a User

- **URL:** `/:id`
- **Method:** DELETE
- **Description:** Delete a specific user by ID from the database.
- **Parameters:**
  - `id` (path parameter): ID of the user to delete.
- **Authentication:** JWT token required.
- **Example Request:**
  ```http
  DELETE /api/users/XXXXXXXXXXXX3 HTTP/1.1
  Host: example.com
  Authorization: Bearer <JWT token>
  Content-Type: application/json
  ```
- **Example Response:**
  ```json
  {
    "message": "User deleted successfully!"
  }
  ```

### Project Module

This module handles project management. It allows projects to be retrieved, created, updated, and deleted. Routes that retrieve projects are public and do not require authentication. All other routes are protected and require a valid JWT token to access.

Base URL: `/api/projects`

#### Endpoints

##### Retrieve All Projects

- **URL:** `/`
- **Method:** GET
- **Description:** Retrieve all projects from the database.
- **Example Request:**
  ```http
  GET /api/projects HTTP/1.1
  Host: example.com
  ```
- **Example Response:**
  ```json
  [
    {
      "_id": "XXXXXXXXXXXX1",
      "title": "Project 1",
      "summary": "Summary of Project 1",
      "description": "Description of Project 1",
      "link": "https://example.com/project1",
      "tags": ["tag1", "tag2"],
      "image": "/public/projects/project1XXXXXXXXXXXX.jpg"
    },
    {
      "_id": "XXXXXXXXXXXX2",
      "title": "Project 2",
      "summary": "Summary of Project 2",
      "description": "Description of Project 2",
      "link": "https://example.com/project2",
      "tags": ["tag1", "tag3"],
      "image": "/public/projects/project2XXXXXXXXXXXX.jpg"
    }
  ]
  ```

##### Retrieve a Specific Project

- **URL:** `/:id`
- **Method:** GET
- **Description:** Retrieve a specific project by ID from the database.
- **Parameters:**
  - `id` (path parameter): ID of the project to retrieve.
- **Example Request:**
  ```http
  GET /api/projects/XXXXXXXXXXXX21 HTTP/1.1
  Host: example.com
  ```
- **Example Response:**
  ```json
  {
    "_id": "XXXXXXXXXXXX1",
    "title": "Project 1",
    "summary": "Summary of Project 1",
    "description": "Description of Project 1",
    "link": "https://example.com/project1",
    "tags": ["tag1", "tag2"],
    "image": "/public/projects/project1XXXXXXXXXXXX.jpg"
  }
  ```

##### Create a New Project

- **URL:** `/`
- **Method:** POST
- **Description:** Create a new project in the database.
- **Parameters:**
  - `title` (string): Title of the project.
  - `summary` (string): Summary of the project.
  - `description` (string): Description of the project.
  - `link` (string): Link to the project.
  - `tags` (array): Array of tags associated with the project.
- **Example Request:**

  ```http
  POST /api/projects HTTP/1.1
  Host: example.com
  Authorization: Bearer <JWT token>
  Content-Type: application/json

  {
    "title": "New Project",
    "summary": "Summary of New Project",
    "description": "Description of New Project",
    "link": "https://example.com/newproject",
    "tags": ["tag1", "tag2"]
  }
  ```

- **Example Response:**
  ```json
  {
    "_id": "XXXXXXXXXXXX3",
    "title": "New Project",
    "summary": "Summary of New Project",
    "description": "Description of New Project",
    "link": "https://example.com/newproject",
    "tags": ["tag1", "tag2"],
    "image": ""
  }
  ```

##### Update a Project

- **URL:** `/:id`
- **Method:** PUT
- **Description:** Update a specific project by ID in the database.
- **Parameters:**
  - `id` (path parameter): ID of the project to update.
  - `title` (string): Updated title of the project.
  - `summary` (string): Updated summary of the project.
  - `description` (string): Updated description of the project.
  - `link` (string): Updated link to the project.
  - `tags` (array): Updated array of tags associated with the project.
- **Example Request:**

  ```http
  PUT /api/projects/XXXXXXXXXXXX3 HTTP/1.1
  Host: example.com
  Authorization: Bearer <JWT token>
  Content-Type: application/json

  {
    "title": "Updated Project",
    "summary": "Updated summary of Project",
    "description": "Updated description of Project",
    "link": "https://example.com/updatedproject",
    "tags": ["tag1", "tag3"]
  }
  ```

- **Example Response:**
  ```json
  {
    "_id": "XXXXXXXXXXXX3",
    "title": "Updated Project",
    "summary": "Updated summary of Project",
    "description": "Updated description of Project",
    "link": "https://example.com/updatedproject",
    "tags": ["tag1", "tag3"],
    "image": "/public/projects/project1XXXXXXXXXXXX.jpg"
  }
  ```

##### Update Project Image

- **URL:** `/:id/upload`
- **Method:** PUT
- **Description:** Update the image of a specific project by ID in the database.
- **Parameters:**
  - `id` (path parameter): ID of the project to update.
  - `image` (file): Image file to upload for the project.
- **Example Request:**

  ```http
  PUT /api/projects/XXXXXXXXXXXX3/upload HTTP/1.1
  Host: example.com
  Authorization: Bearer <JWT token>
  Content-Type: multipart/form-data

  --boundary
  Content-Disposition: form-data; name="image"; filename="project_image.jpg"
  Content-Type: image/jpeg

  <image file content>
  --boundary--
  ```

- **Example Response:**
  ```json
  {
    "_id": "XXXXXXXXXXXX3",
    "title": "Updated Project",
    "summary": "Updated summary of Project",
    "description": "Updated description of Project",
    "link": "https://example.com/updatedproject",
    "tags": ["tag1", "tag3"],
    ,
    "image": "/public/projects/project_imageXXXXXXXXXXXX.jpg"
  }
  ```

##### Delete a Project

- **URL:** `/:id`
- **Method:** DELETE
- **Description:** Delete a specific project by ID from the database.
- **Parameters:**
  - `id` (path parameter): ID of the project to delete.
- **Example Request:**
  ```http
  DELETE /api/projects/XXXXXXXXXXXX3 HTTP/1.1
  Host: example.com
  Authorization: Bearer <JWT token>
  Content-Type: application/json
  ```
- **Example Response:**
  ```json
  {
    "message": "Project deleted successfully!"
  }
  ```

### Tags Module

This module handles all requests related to tags. Routes that retrieve tags are public and do not require authentication. All other routes are protected and require a valid JWT token to access.

Base URL: `/api/tags`

#### Endpoints

##### Retrieve All Tags

- **URL:** `/`
- **Method:** GET
- **Description:** Retrieve all tags from the database.
- **Example Request:**
  ```http
  GET /api/tags HTTP/1.1
  Host: example.com
  ```
- **Example Response:**
  ```json
  [
    {
      "_id": "XXXXXXXXXXXX1",
      "name": "Tag1"
    },
    {
      "_id": "XXXXXXXXXXXX2",
      "name": "Tag2"
    }
  ]
  ```

##### Retrieve a Specific Tag

- **URL:** `/:id`
- **Method:** GET
- **Description:** Retrieve a specific tag by ID from the database.
- **Parameters:**
  - `id` (path parameter): ID of the tag to retrieve.
- **Example Request:**
  ```http
  GET /api/tags/XXXXXXXXXXXX1 HTTP/1.1
  Host: example.com
  ```
- **Example Response:**
  ```json
  {
    "_id": "XXXXXXXXXXXX1",
    "name": "Tag1"
  }
  ```

##### Create a New Tag

- **URL:** `/`
- **Method:** POST
- **Description:** Create a new tag in the database.
- **Parameters:**
  - `name` (string): Name of the tag.
- **Authentication:** JWT token required.
- **Example Request:**

  ```http
  POST /api/tags HTTP/1.1
  Host: example.com
  Authorization: Bearer <JWT token>
  Content-Type: application/json

  {
    "name": "Tag3"
  }
  ```

- **Example Response:**
  ```json
  {
    "_id": "XXXXXXXXXXXX3",
    "name": "Tag3"
  }
  ```

##### Update a Tag

- **URL:** `/:id`
- **Method:** PUT
- **Description:** Update a specific tag by ID in the database.
- **Parameters:**
  - `id` (path parameter): ID of the tag to update.
  - `name` (string): Updated name of the tag.
- **Authentication:** JWT token required.
- **Example Request:**

  ```http
  PUT /api/tags/XXXXXXXXXXXX3 HTTP/1.1
  Host: example.com
  Authorization: Bearer <JWT token>
  Content-Type: application/json

  {
    "name": "UpdatedTag3"
  }
  ```

- **Example Response:**
  ```json
  {
    "_id": "XXXXXXXXXXXX3",
    "name": "UpdatedTag3"
  }
  ```

##### Delete a Tag

- **URL:** `/:id`
- **Method:** DELETE
- **Description:** Delete a specific tag by ID from the database.
- **Parameters:**
  - `id` (path parameter): ID of the tag to delete.
- **Authentication:** JWT token required.
- **Example Request:**
  ```http
  DELETE /api/tags/XXXXXXXXXXXX3 HTTP/1.1
  Host: example.com
  Authorization: Bearer <JWT token>
  Content-Type: application/json
  ```
- **Example Response:**
  ```json
  {
    "message": "Tag deleted successfully!"
  }
  ```
