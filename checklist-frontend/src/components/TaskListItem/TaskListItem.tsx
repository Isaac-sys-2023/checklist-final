import { Task } from "@/types/Tasks";

interface TaskListItemProps {
    task: Task;
    onToggle: (taskId: number) => void;
}

const TaskListItem = ({ task, onToggle }: TaskListItemProps) => {
    return (
        <div>
            <h2>{task.title}</h2>
            <p>{task.day}</p>
            <input type="checkbox" checked={task.completed} onChange={() => onToggle(task.id)} />
        </div>
    );
};

export default TaskListItem;
