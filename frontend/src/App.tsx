import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import TaskForm from './components/TaskForm';
import './App.css';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDateTime: Date;
  recurrence: string;
}

const App: React.FC = () => {
  const [notifications, setNotifications] = useState<string[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const socket = io('http://localhost:3001');

    socket.on('notify', (message: string) => {
      setNotifications((prev) => [...prev, message]);
    });

    socket.on('task-added', (task: Task) => {
      setTasks((prev) => [...prev, { ...task, dueDateTime: new Date(task.dueDateTime) }]);
    });

    socket.on('task-deleted', (taskId: string) => {
      setTasks((prev) => prev.filter(task => task.id !== taskId));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    fetch('http://localhost:3001/tasks')
      .then(response => response.json())
      .then(data => setTasks(data.map((task: Task) => ({ ...task, dueDateTime: new Date(task.dueDateTime) }))));
  }, []);

  const addTask = (task: Omit<Task, 'id'>) => {
    const socket = io('http://localhost:3001');
    socket.emit('new-task', task);
  };

  const deleteTask = (taskId: string) => {
    fetch(`http://localhost:3001/tasks/${taskId}`, {
      method: 'DELETE'
    }).then(() => {
      const socket = io('http://localhost:3001');
      socket.emit('delete-task', taskId);
    });
  };

  return (
    <div className="App">
      <TaskForm onAddTask={addTask} />
      <h2 className="ml-20">Tasks</h2>
      <ul className="task-block">
        {tasks.map((task) => (
          <li key={task.id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Due: {task.dueDateTime.toLocaleString()}</p>
            <p>Recurrence: {task.recurrence}</p>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <h2 className="ml-20">Notifications</h2>
      <ul className="task-block">
        {notifications.map((notification, index) => (
          <li key={index}>{notification}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;