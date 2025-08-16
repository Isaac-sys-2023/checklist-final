"use client";
import { Task } from "@/types/Tasks";
import { useEffect, useState } from "react";
import TaskModal from "@/components/TaskModal/TaskModal";
import MultiTaskModal from "@/components/MultiTaskModal/MultiTaskModal";
import TaskListItem from "@/components/TaskListItem/TaskListItem";
import "@/styles/app/homeStyles.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface TaskDayListProps {
    date: string;
}

export default function TaskDayList({ date }: TaskDayListProps) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [showMultiModal, setShowMultiModal] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    useEffect(() => {
        try {
            fetchTasks();
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
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedTask),
                });
                if (!response.ok) {
                    throw new Error("Failed to update task");
                }
                setTasks((prevTasks) =>
                    prevTasks.map((t) => (t.id === taskId ? updatedTask : t))
                );
            }
        } catch (error) {
            console.error("Error toggling task:", error);
        }
    };

    const handleEditTask = (taskId: number) => {
        const task = tasks.find((task: Task) => task.id === taskId);
        if (task) {
            setEditingTask(task);
            setShowModal(true);
        }
    };

    const handleDeleteTask = async (taskId: number) => {
        try {
            const response = await fetch(`${API_URL}/tasks/${taskId}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Failed to delete task");
            }
            setTasks((prevTasks) => prevTasks.filter((t) => t.id !== taskId));
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const hoy = () => {
        const [year, month, day] = date.split("-");
        const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        
        const jsDate = new Date(Number(year), Number(month) - 1, Number(day));
        const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        return `${date === getLocalTodayDateString() ? "Hoy es" : "Para el"} ${days[jsDate.getDay()]} ${Number(day)} de ${months[Number(month) - 1]} de ${year}`;
    };

    const getLocalTodayDateString = () => {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const fetchTasks = async () => {
        await fetch(`${API_URL}/tasks`)
            .then((res) => res.json())
            .then((data) => {
                console.log("Tasks from backend:", data);
                console.log("Prop date:", date);
                setTasks(
                    data.filter(
                        (task: Task) =>
                            task.day && task.day === date
                    ) as Task[]
                );
            });
    };

    const closeModal = async () => {
        setShowModal(false);
        setShowMultiModal(false);
        await fetchTasks();
    };

    return (
        <div className="home-container">
            <h1 className="title-home">Tus tareas{date === getLocalTodayDateString() ? " de hoy" : ""}</h1>
            <h2 className="subtitle-home">{hoy()}</h2>

            <div className="home-buttons-group">
                <button className="button" onClick={() => setShowModal(true)}>
                    New Task +
                </button>
                <button className="button" onClick={() => setShowMultiModal(true)}>
                    Multi Tasks with JSON
                </button>
            </div>

            <div>
                {tasks
                    .map((task: Task) => (
                        <TaskListItem
                            key={task.id}
                            task={task}
                            onToggle={handleToggleTask}
                            onDelete={handleDeleteTask}
                            onEdit={handleEditTask}
                        />
                    ))}
            </div>

            {showModal && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        background: "rgba(0,0,0,0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000,
                    }}
                >
                    <div
                        style={{
                            background: "#222",
                            padding: "2rem",
                            borderRadius: "8px",
                            minWidth: "300px",
                        }}
                    >
                        {editingTask ? (
                            <TaskModal onClose={closeModal} task={editingTask} />
                        ) : (
                            <TaskModal onClose={closeModal} />
                        )}
                        <button
                            onClick={() => closeModal()}
                            style={{ marginTop: "1rem" }}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}

            {showMultiModal && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        background: "rgba(0,0,0,0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000,
                    }}
                >
                    <div
                        style={{
                            background: "#222",
                            padding: "2rem",
                            borderRadius: "8px",
                            minWidth: "300px",
                        }}
                    >
                        <MultiTaskModal onClose={closeModal} />
                        <button
                            onClick={() => closeModal()}
                            style={{ marginTop: "1rem" }}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}