import { useSortable } from "@dnd-kit/react/sortable";
import type { Task } from "./types";
import { CollisionPriority } from "@dnd-kit/abstract";
import { CheckBox } from "./Components/CheckBox";
export function TaskCard({
  task,
  ind,
  setTasks,
}: {
  task: Task;
  ind: number;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}) {
  const { ref, isDragging } = useSortable({
    id: task.id,
    index: ind,
    type: "task",
    accept: "task",
    group: task.colId,
    collisionPriority: CollisionPriority.Normal,
    data: { task, rank: task.rank, colId: task.colId },
  });


  const strikethrough = {1: 'line-through', 0: ''}

  return (
    <div
      ref={ref}
      className={` ${isDragging ? "bg-neutral-400" : " bg-neutral-100"} group w-full min-h-12 rounded-md mt-2 flex flex-col justify-center`}
    >
      <div
        className={`${isDragging ? "opacity-0" : ""} flex items-center px-2`}
      >
        <div>
          <CheckBox
            checked={task.completed}
            size={5}
            onChange={(e) => {
              setTasks((prev) => {
                return prev.map((t) => {
                  if (t.id === task.id) return { ...t, completed: !t.completed }
                  else return t
                })
                
              })
            }}
          ></CheckBox>
        </div>
        <div className={`px-2 wrap-break-word ${strikethrough[task.completed === false ? 0: 1]} select-none`}>{task.taskName}</div>
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
