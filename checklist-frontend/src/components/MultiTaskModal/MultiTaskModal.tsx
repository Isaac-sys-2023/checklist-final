"use client";
import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface MultiTaskModalProps {
    onClose: () => void;
}

const MultiTaskModal = ({ onClose }: MultiTaskModalProps) => {
    const [tasks, setTasks] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (tasks) {
            try {
                const response = await fetch(`${API_URL}/tasks/bulk`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(JSON.parse(tasks)),
                });
                if (!response.ok) {
                    throw new Error('Failed to create task');
                }
                setTasks("");
                onClose();
            } catch (error) {
                console.error("Error creating tasks:", error);
            }
        }
    };

    return(
        <div style={{padding: '1rem', background: '#444', borderRadius: '8px'}}>
            <h1 style={{padding: '0 1rem 1rem 1rem', fontSize: '1.5rem',textAlign: 'center'}}>New Tasks with JSON</h1>
            <form style={{display: 'flex', flexDirection: 'column', gap: '1rem'}} onSubmit={handleSubmit}>
                <input type="text" placeholder="Tasks in JSON" value={tasks} onChange={(e) => setTasks(e.target.value)} />
                <button type="submit">Add Tasks</button>
            </form>
        </div>
    )
}

export default MultiTaskModal;