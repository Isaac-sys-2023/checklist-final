"use client";
import { Task } from "@/types/Tasks";
import Image from "next/image";
import { useEffect, useState } from "react";
import TaskModal from "@/components/TaskModal/TaskModal";
import MultiTaskModal from "@/components/MultiTaskModal/MultiTaskModal";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showMultiModal, setShowMultiModal] = useState(false);

  useEffect(() => {
    try {
      fetch(`${API_URL}/tasks`)
        .then(res => res.json())
        .then(data => setTasks(data as Task[]));
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }, []);

  const handleToggleTask = async (taskId: number) => {
    try {
      const task = tasks.find((task: Task) => task.id === taskId);
      if (task) {
        const updatedTask = { ...task, completed: !task.completed };
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedTask),
        });
        if (!response.ok) {
          throw new Error('Failed to update task');
        }
        setTasks((prevTasks) =>
          prevTasks.map((t) => (t.id === taskId ? updatedTask : t))
        );
      }
    } catch (error) {
      console.error("Error toggling task:", error);
    }
  };

  return (
    <div>
      <h1>Tus tareas de hoy</h1>
      
      <button onClick={() => setShowModal(true)} style={{marginBottom: '1rem'}}>New Task +</button>
      <button onClick={() => setShowMultiModal(true)} style={{marginBottom: '1rem'}}>Multi Tasks with JSON</button>

      <div>
        {tasks.filter((task: Task) => task.day && task.day === new Date().toISOString().split("T")[0]).map((task: Task) => (
          <div key={task.id}>
            <h2>{task.title}</h2>
            <p>{task.day}</p>
            <input type="checkbox" checked={task.completed} onChange={() => handleToggleTask(task.id)} />
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
          <div style={{background: '#222', padding: '2rem', borderRadius: '8px', minWidth: '300px'}}>
            <TaskModal />
            <button onClick={() => setShowModal(false)} style={{marginTop: '1rem'}}>Cerrar</button>
          </div>
        </div>
      )}

      {showMultiModal && (
        <div style={{position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
          <div style={{background: '#222', padding: '2rem', borderRadius: '8px', minWidth: '300px'}}>
            <MultiTaskModal />
            <button onClick={() => setShowMultiModal(false)} style={{marginTop: '1rem'}}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}
