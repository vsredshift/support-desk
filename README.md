# Support Desk Ticketing System

A MERN stack application designed to streamline the process of creating and managing support tickets. Based on a project by Brad Traversy.

## Features

- **User Authentication**: Secure user registration and login functionality.
- **Ticket Management**: Users can create, view, and manage support tickets.
- **Real-time Updates**: Immediate reflection of ticket statuses and notes.

## Technologies Used

- **Frontend**: React.js
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **State Management**: Redux Toolkit
- **Authentication**: JSON Web Tokens (JWT)

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/vsredshift/support-desk.git
   cd support-desk
   ```

2. **Install backend dependencies**:

   ```bash
   npm install
   ```

3. **Install frontend dependencies**:

   ```bash
   cd frontend
   npm install
   ```

4. **Set up environment variables**:

   - Rename the `.envexample` file to `.env`.
   - Add your MongoDB URI and JWT secret to the `.env` file.

## Running the Application

- **Development Mode**:

  ```bash
  npm run dev
  ```

  This command concurrently runs both the backend and frontend servers.

- **Production Mode**:

  ```bash
  npm start
  ```

  Ensure that the frontend is built and served correctly in production.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License.

