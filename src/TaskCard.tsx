import type { Task } from "./types";

export function TaskCard({ task }: { task: Task }) {

  const isDragging = false;
  return (
    <div
     
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
