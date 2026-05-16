import { TaskCard } from "./TaskCard";
import { TaskItem } from "@/hooks/useRoadmapStore";

interface TaskGridProps {
  phaseId: number;
  tasks: TaskItem[];
  onToggle: (taskId: string, completed: boolean) => void;
  disabled?: boolean;
}

export function TaskGrid({ phaseId, tasks, onToggle, disabled }: TaskGridProps) {
  if (!tasks || tasks.length === 0) return null;
  
  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold mb-4">Tugas Fase {phaseId}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tasks.map((task, index) => (
          <TaskCard 
            key={task.id} 
            number={index + 1} 
            task={task} 
            onToggle={(completed) => onToggle(task.id, completed)}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}
