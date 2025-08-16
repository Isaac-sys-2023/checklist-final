"use client";
import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface TaskModalProps {
    onClose: () => void;
}

const TaskModal = ({ onClose }: TaskModalProps) => {
    const [taskTitle, setTaskTitle] = useState("");
    const [taskDate, setTaskDate] = useState(new Date().toISOString().split("T")[0]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (taskTitle.trim()) {
            try {
                const response = await fetch(`${API_URL}/tasks`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ title: taskTitle, completed: false, day: taskDate }),
                });
                if (!response.ok) {
                    throw new Error('Failed to create task');
                }
                setTaskTitle("");
                setTaskDate(new Date().toISOString().split("T")[0]);

                onClose();
            } catch (error) {
                console.error("Error creating task:", error);
            }
        }
    };

    return(
        <div style={{padding: '1rem', background: '#444', borderRadius: '8px'}}>
            <h1 style={{padding: '0 1rem 1rem 1rem', fontSize: '1.5rem',textAlign: 'center'}}>New Task</h1>
            <form style={{display: 'flex', flexDirection: 'column', gap: '1rem'}} onSubmit={handleSubmit}>
                <input type="text" placeholder="Task Title" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} />
                <input type="date" value={taskDate} onChange={(e) => setTaskDate(e.target.value)} placeholder="Task Date"/>
                <button type="submit">Add Task</button>
            </form>
        </div>
    )
}

export default TaskModal;