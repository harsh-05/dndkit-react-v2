import { useSortable } from "@dnd-kit/react/sortable";
import type { Task } from "./types";
import { CollisionPriority } from "@dnd-kit/abstract";
import { CheckBox } from "./Components/CheckBox";
import {motion} from "motion/react"
import { useState } from "react";
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

  const strikethrough = { 1: "line-through", 0: "" };
  const [hovered, setHovered] = useState(false);

  const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
  // ONE shared transition — if these differ even slightly, the effect falls apart
  const REVEAL = { duration: 0.6, ease: EASE, delay: 0.08 };

  const CHECKBOX_SIZE = 4;
  const CHECKBOX_PX = CHECKBOX_SIZE * 4; // tailwind size-5 = 20px

  const showCheckBox = hovered || task.completed;

  return (
    <motion.div
      layout
      ref={ref}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className={` ${isDragging ? "bg-neutral-400" : " bg-neutral-100"} w-full min-h-12 rounded-md mt-2 flex flex-col justify-center`}
    >
      <div
        className={`${isDragging ? "opacity-0" : ""} flex items-center px-2`}
      >
        {/* Layer 1: WIDTH only — pushes the text via layout */}
        <motion.div
          initial={false}
          animate={{
            width: showCheckBox ? CHECKBOX_PX : 0,
            opacity: showCheckBox ? 1 : 0,
          }}
          transition={REVEAL}
          className="relative shrink-0" // ← overflow-hidden REMOVED
          style={{ pointerEvents: showCheckBox ? "auto" : "none" }}
        >
          {/* Layer 2: OPACITY only — checkbox is full-size the entire time */}
         
            <CheckBox
              checked={task.completed}
              size={CHECKBOX_SIZE}
              onChange={(e) => {
                setTasks((prev) =>
                  prev.map((t) =>
                    t.id === task.id ? { ...t, completed: !t.completed } : t,
                  ),
                );
              }}
            />
         
        </motion.div>

        <div
          className={`px-2 wrap-break-word ${strikethrough[task.completed === false ? 0 : 1]} select-none`}
        >
          {task.taskName}
        </div>
      </div>
    </motion.div>
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
