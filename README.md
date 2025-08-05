# Trading Game Application

This repository contains the full stack for the Trading Game application, including a React frontend, a Node.js/Express backend, and a MariaDB database.

## Overview

The Trading Game is a web application designed to simulate a trading card game experience. Users can manage their card collections, initiate and respond to trades, and interact with an administrative interface. The application is built with a modern JavaScript stack, utilizing React for the frontend and Node.js with Express for the backend, backed by a MariaDB database.

## Features

- User authentication and profile management
- Card collection display and management
- Trading system for exchanging cards
- Admin panel for managing game settings and users
- QR code scanning for in-game interactions (e.g., adding cards)

## Technologies Used

**Frontend:**
- React.js
- HTML5-QRCode (for QR scanning)
- CSS

**Backend:**
- Node.js
- Express.js
- MariaDB (via `mariadb` npm package)
- `dotenv` for environment variable management

**Database:**
- MariaDB

**Deployment/Orchestration:**
- Docker
- Docker Compose

## Getting Started

These instructions will get a copy of the project up and running on your local machine for development and testing purposes using Docker.

### Prerequisites

Make sure you have Docker and Docker Compose installed on your system.

- [Docker Desktop](https://www.docker.com/products/docker-desktop)

### Installation and Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/D-Best-Apps/Trading-Card-Game/tree/main
    cd Trading\ Game # Or the name of your cloned directory
    ```
    **IMPORTANT:** Replace `https://github.com/D-Best-Apps/Trading-Card-Game/tree/main` with the actual HTTPS URL of your GitHub repository (e.g., `(https://github.com/D-Best-Apps/Trading-Card-Game.git)`).

2.  **Configure Environment Variables:**
    Create a `.env` file in the root of your project directory (where `docker-compose.yml` is located). This file will store your database credentials and other sensitive information. **Do NOT commit this file to your Git repository.**

    ```dotenv
    DB_USER=your_db_user
    DB_PASSWORD=your_db_password
    DB_DATABASE=trading_game_db
    DB_ROOT_PASSWORD=your_db_root_password
    ```
    Replace `your_db_user`, `your_db_password`, and `your_db_root_password` with your desired credentials.

3.  **Build and Run with Docker Compose:**
    From the root of your project directory, run the following commands to build the Docker images and start the services:

    ```bash
    docker-compose build
    docker-compose up -d
    ```
    - `docker-compose build`: This command builds the Docker images for your server and database. The server image will automatically clone the latest code from your GitHub repository and build the React frontend.
    - `docker-compose up -d`: This command starts the services defined in your `docker-compose.yml` file in detached mode (in the background).

4.  **Access the Application:**
    Once the services are up and running, you can access the application in your web browser at:

    ```
    http://localhost:5000
    ```

    The database will be initialized automatically with the SQL scripts (`DB-Admin-Structure.sql`, `DB-Structure.sql`, `Card-Details.sql`, `Cards-webp.sql`) located in the root of your project.

## Updating the Application

When you make changes to your code and push them to your GitHub repository, you can update your running application by:

1.  **Pulling the latest changes (if you're on a server and cloned the repo):**
    ```bash
    git pull origin main # Or your main branch name
    ```
    *(This step is only necessary if you initially cloned the repo on the server. If you're just rebuilding the Docker image from scratch, the `docker-compose build` will pull the latest code.)*

2.  **Rebuilding and restarting the Docker containers:**
    ```bash
    docker-compose down
    docker-compose build
    docker-compose up -d
    ```
    Alternatively, you can use a single command to rebuild and restart:
    ```bash
    docker-compose up -d --build
    ```

## Project Structure

```
.gitignore
Card-Details.sql
Cards-webp.sql
DB-Admin-Structure.sql
DB-Structure.sql
docker-compose.yml
.env
.vscode/
client/
├───.env
├───.gitignore
├───package-lock.json
├───package.json
├───README.md
├───build/...
├───node_modules/...
├───public/...
└───src/...
server/
├───.env
├───package-lock.json
├───package.json
├───server.js
├───Dockerfile
├───config/...
├───controllers/...
├───node_modules/...
├───routes/...
└───utils/...
```

## Contributing

Feel free to fork the repository, make changes, and submit pull requests. Please ensure your code adheres to the existing style and passes all tests.

## License

[Specify your license here, e.g., MIT License, Apache 2.0 License, etc.]
