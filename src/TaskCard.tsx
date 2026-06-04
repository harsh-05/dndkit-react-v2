import { useSortable } from "@dnd-kit/react/sortable";
import type { Task } from "./types";
import { CollisionPriority } from '@dnd-kit/abstract'
export function TaskCard({ task, ind }: { task: Task, ind:number }) {

  const { ref, isDragging } = useSortable({
    id: task.id,
    index: ind,
    type: "task",
    accept: "task",
    group: task.colId,
    collisionPriority: CollisionPriority.Normal,
    data: { task, rank: task.rank, colId: task.colId },
   
  });

  
  return (
    <div
     ref={ref}
      className={` ${isDragging ? "bg-neutral-400" : " bg-neutral-100"} w-full min-h-12 rounded-md mt-2 flex flex-col justify-center`}
    >
      <div
        className={`${isDragging ? "opacity-0" : ""}`}
      >
        <div className="ml-2">{task.taskName}</div>
      </div>
    </div>
  );
}

export function TaskCardPreview({ task }: { task: Task }) {
  return (
    <div
      className={`w-full min-h-12 rounded-md bg-neutral-100 mt-2 flex flex-col justify-center`}
    >
      <div className="ml-2">{task.taskName}</div>
    </div>
  );
}
