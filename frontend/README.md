# Task Scheduler App

This is a Task Scheduler application that allows users to create, delete, and receive notifications for tasks. The application supports both non-recurring and recurring tasks with various recurrence patterns.

## Features

- Create tasks with a title, description, due date/time, and recurrence pattern.
- Delete tasks.
- Receive real-time notifications when tasks are due.
- Supports daily, weekly, monthly, yearly, hourly, and minute recurrence patterns.

## Technologies Used

- Node.js
- Express
- Socket.IO
- Node-Cron
- Moment.js
- UUID
- CORS

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:

   git clone https://github.com/your-username/task-scheduler-app.git
   cd task-scheduler-app

2. Install the dependencies:

   npm install

3. Start the server:

   npm start

   The server will start on port 3001.

### Running the Application

1. Ensure the server is running by following the setup instructions above.
2. Open your browser and navigate to `http://localhost:3000` to access the client application (assuming you have a client application running on this port).

## API Endpoints

### Get All Tasks

- **URL:** `/tasks`
- **Method:** `GET`
- **Description:** Retrieve all tasks.

### Delete a Task

- **URL:** `/tasks/:id`
- **Method:** `DELETE`
- **Description:** Delete a task by its ID.

## Socket.IO Events

### `new-task`

- **Description:** Create a new task.
- **Payload:**
  {
  "title": "Task Title",
  "description": "Task Description",
  "dueDateTime": "2024-08-12T20:12:00Z",
  "recurrence": "none"
  }

### `delete-task`

- **Description:** Delete a task by its ID.
- **Payload:**
  {
  "taskId": "task-id"
  }

### `task-added`

- **Description:** Emitted when a new task is added.
- **Payload:**
  {
  "id": "task-id",
  "title": "Task Title",
  "description": "Task Description",
  "dueDateTime": "2024-08-12T20:12:00Z",
  "recurrence": "none"
  }

### `task-deleted`

- **Description:** Emitted when a task is deleted.
- **Payload:**
  {
  "taskId": "task-id"
  }

### `notify`

- **Description:** Emitted when a task is due.
- **Payload:**
  {
  "message": "Task \"Task Title\" is due! [2024-08-12 20:12:00]"
  }

## Additional Information

- The server uses `node-cron` to schedule task notifications.
- Timestamps in notifications are formatted using `moment.js`.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
