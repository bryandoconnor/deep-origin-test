import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import cron from 'node-cron';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import moment from 'moment-timezone';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDateTime: Date;
  recurrence: string;
}

const app = express();
const server = http.createServer(app);

// Logging middleware to log all incoming requests
app.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  next();
});

// Use CORS middleware for Express
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'DELETE']
}));

// Middleware to parse JSON bodies
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'DELETE']
  }
});

const tasksFilePath = path.join(__dirname, 'tasks.json');
let tasks: Task[] = [];
const scheduledTasks: { [key: string]: cron.ScheduledTask[] } = {};

// Load tasks from the JSON file when the server starts
const loadTasks = () => {
  if (fs.existsSync(tasksFilePath)) {
    const data = fs.readFileSync(tasksFilePath, 'utf8');
    tasks = JSON.parse(data, (key, value) => {
      if (key === 'dueDateTime') return new Date(value);
      return value;
    });
    tasks.forEach(task => scheduleTaskNotification(task));
  }
};

// Save tasks to the JSON file
const saveTasks = () => {
  fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
};

io.on('connection', (socket) => {
  socket.on('new-task', (task: Omit<Task, 'id'>) => {
    const newTask: Task = { ...task, id: uuidv4() };
    tasks.push(newTask);
    saveTasks();
    io.emit('task-added', newTask);
    scheduleTaskNotification(newTask);
  });

  socket.on('delete-task', (taskId: string) => {
    deleteTask(taskId);
  });
});

const scheduleTaskNotification = (task: Task) => {
  const { id, dueDateTime, recurrence } = task;
  const dueDateTimeUTC = moment(dueDateTime).utc();
  const nowUTC = moment.utc();

  // Schedule a one-time cron job to notify the user at the specified due date
  const cronTime = `${dueDateTimeUTC.minutes()} ${dueDateTimeUTC.hours()} ${dueDateTimeUTC.date()} ${dueDateTimeUTC.month() + 1} *`;

  const initialTask = cron.schedule(cronTime, () => {
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    io.emit('notify', `Task "${task.title}" is due! [${timestamp}]`);
    initialTask.stop();
  });

  // Check if the task should have already been executed
  if (nowUTC.isSameOrAfter(dueDateTimeUTC)) {
    io.emit('notify', `Task "${task.title}" is due! [${nowUTC.format('YYYY-MM-DD HH:mm:ss')}]`);
    initialTask.stop(); // Stop the task if it's already due
  }

  scheduledTasks[id] = [initialTask];

  let recurrencePattern = '';
  
  // Handle recurring tasks
  if (recurrence !== 'none') {
    switch (recurrence) {
      case 'daily':
        recurrencePattern = `${dueDateTimeUTC.minutes()} ${dueDateTimeUTC.hours()} * * *`;
        break;
      case 'weekly':
        recurrencePattern = `${dueDateTimeUTC.minutes()} ${dueDateTimeUTC.hours()} * * ${dueDateTimeUTC.day()}`;
        break;
      case 'monthly':
        recurrencePattern = `${dueDateTimeUTC.minutes()} ${dueDateTimeUTC.hours()} ${dueDateTimeUTC.date()} * *`;
        break;
      case 'yearly':
        recurrencePattern = `${dueDateTimeUTC.minutes()} ${dueDateTimeUTC.hours()} ${dueDateTimeUTC.date()} ${dueDateTimeUTC.month() + 1} *`;
        break;
      case 'hourly':
        recurrencePattern = `${dueDateTimeUTC.minutes()} * * * *`;
        break;
      case 'minute':
        recurrencePattern = `* * * * *`;
        break;
      default:
        return;
    }
  }

  // Schedule a one-time cron job to start the recurring cron job at the specified due date and time
  const startCronTime = `${dueDateTimeUTC.minutes()} ${dueDateTimeUTC.hours()} ${dueDateTimeUTC.date()} ${dueDateTimeUTC.month() + 1} *`;
  const startTask = cron.schedule(startCronTime, () => {
    // Notify immediately if dueDateTime is now or has passed
    if (nowUTC.isSameOrAfter(dueDateTimeUTC)) {
      io.emit('notify', `Recurring task "${task.title}" is due! [${nowUTC.format('YYYY-MM-DD HH:mm:ss')}]`);
    }

    const recurringTask = cron.schedule(recurrencePattern, () => {
      const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
      io.emit('notify', `Recurring task "${task.title}" is due! [${timestamp}]`);
    });

    scheduledTasks[id] = [recurringTask];
    startTask.stop();
  });

  // Check if the initial start task should have already started
  if (nowUTC.isSameOrAfter(dueDateTimeUTC)) {
    startTask.stop();
    io.emit('notify', `Recurring task "${task.title}" is due! [${nowUTC.format('YYYY-MM-DD HH:mm:ss')}]`);
  } else {
    scheduledTasks[id] = [startTask];
  }
};

const deleteTask = (taskId: string) => {
  const taskIndex = tasks.findIndex(task => task.id === taskId);
  if (taskIndex !== -1) {
    tasks.splice(taskIndex, 1);
    saveTasks();
    io.emit('task-deleted', taskId);

    // Cancel scheduled notifications
    if (scheduledTasks[taskId]) {
      scheduledTasks[taskId].forEach(task => task.stop());
      delete scheduledTasks[taskId];
    }
  }
};

app.delete('/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  deleteTask(taskId);
  res.status(200).send({ message: 'Task deleted successfully' });
});

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.get('/test-cors', (req, res) => {
  res.json({ message: 'CORS is working!' });
});

export const emitNotification = (message: string) => {
  const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
  io.emit('notify', `${message} [${timestamp}]`);
};

server.listen(3001, () => {
  console.log('Server running on port 3001');
  loadTasks();
});