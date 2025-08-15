import { Task } from "@/types/Tasks";

interface TaskListItemProps {
    task: Task;
    onToggle: (taskId: number) => void;
    onDelete: (taskId: number) => void;
}

const TaskListItem = ({ task, onToggle, onDelete }: TaskListItemProps) => {
    return (
        <div>
            <h2>{task.title}</h2>
            <p>{task.day}</p>
            <input type="checkbox" checked={task.completed} onChange={() => onToggle(task.id)} />
            <button style={{padding: '1rem'}} onClick={() => onDelete(task.id)}>x</button>
        </div>
    );
};

export default TaskListItem;
