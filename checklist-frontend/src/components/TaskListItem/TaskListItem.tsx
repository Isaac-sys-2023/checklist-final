import { Task } from "@/types/Tasks";
import '@/styles/components/TaskListItem.css';

import { Trash2, Circle, CircleCheckBig } from 'lucide-react';

interface TaskListItemProps {
    task: Task;
    onToggle: (taskId: number) => void;
    onDelete: (taskId: number) => void;
}

const TaskListItem = ({ task, onToggle, onDelete }: TaskListItemProps) => {
    return (
        <div className={`task-item-container ${task.completed ? "completed" : "incompleted"}`}>
            <h2 className="task-item-title">{task.title}</h2>
            <p>{task.day}</p>
            <button onClick={() => onToggle(task.id)}>{task.completed ? <CircleCheckBig/> : <Circle/>}</button>
            <button style={{padding: '1rem'}} onClick={() => onDelete(task.id)}><Trash2 /></button>
        </div>
    );
};

export default TaskListItem;
