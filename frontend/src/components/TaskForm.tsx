import React, { useState } from 'react';
import './TaskForm.css';

interface TaskFormProps {
    onAddTask: (task: { title: string; description: string; dueDateTime: Date; recurrence: string; }) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onAddTask }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [dueTime, setDueTime] = useState('');
    const [recurrence, setRecurrence] = useState('none');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const dueDateTime = new Date(`${dueDate}T${dueTime}`);
        onAddTask({ title, description, dueDateTime, recurrence });
        setTitle('');
        setDescription('');
        setDueDate('');
        setDueTime('');
        setRecurrence('none');
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Add Task</h2>
            <div>
                <label>
                    Title:
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </label>
            </div>
            <div>
                <label>
                    Description:
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </label>
            </div>
            <div>
                <label>
                    Due Date:
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                    />
                </label>
            </div>
            <div>
                <label>
                    Due Time:
                    <input
                        type="time"
                        value={dueTime}
                        onChange={(e) => setDueTime(e.target.value)}
                    />
                </label>
            </div>
            <div>
                <label>
                    Recurrence:
                    <select
                        value={recurrence}
                        onChange={(e) => setRecurrence(e.target.value)}
                    >
                        <option value="none">None</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                        <option value="hourly">Every Hour</option>
                        <option value="minute">Every Minute</option>
                    </select>
                </label>
            </div>
            <button type="submit">Add Task</button>
        </form>
    );
};

export default TaskForm;