import { useRef, useState } from "react";
import { AddIcon, ThreeDotsHorizontal } from "./Icons";
import type { Column, DraftTask, Id, Task } from "./types";
import { useSortable } from "@dnd-kit/react/sortable";
import { useOutsideClick } from "./useOnClickOutside";

export function ColumnCard({
  col,
  index,
  generateTask,
  tempTask,
  setTempTask,
  // tasks,
}: {
  col: Column;
  index: number;
  tempTask: DraftTask | undefined;
  setTempTask?: React.Dispatch<React.SetStateAction<DraftTask | undefined>>;
  //   setColTaskName?: Dispatch<SetStateAction<DraftTask | undefined>>;
  //   coltaskName?: DraftTask | undefined;
  generateTask: (taskName: string, colId: Id) => void;
  //   tasks: Task[];
}) {
  //need to be removed

  const { ref, isDragging } = useSortable({
    id: col.id,
    index,
    type: "column",
    data: { colId: col.id, rank: col.rank, column: col },
  });

  return (
    <div
      ref={ref}
      className={`
      ${isDragging ? "bg-neutral-400" : "bg-neutral-200"} 
      min-w-68 max-w-68 max-h-full min-h-0 flex flex-col rounded-md p-2 `}
    >
      <div
        className={`${isDragging ? "opacity-0" : ""} h-full flex flex-col min-h-0`}
      >
        <div className="flex justify-between items-center mb-5 ">
          <div className="text-md font-medium uppercase  pl-4 wrap-break-word min-w-0">
            {col.name}
          </div>
          <div className=" rounded-md hover:bg-black/20 p-1 ">
            <ThreeDotsHorizontal></ThreeDotsHorizontal>
          </div>
        </div>

        {/* Displaying the tasks here... */}
        <div className="flex flex-col  flex-1 min-h-0 overflow-y-auto  "></div>

        {/* Add Card Input Box... Like in trello */}
        <AddTask
          colId={col.id}
          tempTask={tempTask}
          setTempTask={setTempTask}
          generateTask={generateTask}
        ></AddTask>
      </div>
    </div>
  );
}

export function ColumnCardPreview({
  col,
  tempTask,
  //   tasks,
}: {
  col: Column;
  tempTask: DraftTask | undefined;
  //   tasks: Task[];
}) {
  return (
    // max-h-full removed, check and verify.
    <div className="bg-neutral-200 min-w-68 max-w-68  flex flex-col rounded-md p-2 opacity-80 ">
      <div className="flex flex-col min-h-0">
        <div className="flex justify-between items-center mb-5">
          <div className="text-md font-medium uppercase  pl-4 min-w-0 wrap-break-word">
            {col.name}
          </div>
          <div className=" rounded-md hover:bg-black/20 p-1 inline-block">
            <ThreeDotsHorizontal></ThreeDotsHorizontal>
          </div>
        </div>

        <div className="flex flex-col  min-h-0 flex-1 overflow-y-hidden "></div>

        {/* Add Card Input Box... Like in trello */}
        <AddTask tempTask={tempTask}></AddTask>
      </div>
    </div>
  );
}

function AddTask({
  colId,
  tempTask,
  setTempTask,
  generateTask,
}: {
  colId?: Id;
  tempTask: DraftTask | undefined;
  setTempTask?: React.Dispatch<React.SetStateAction<DraftTask | undefined>>;
  generateTask?: (taskName: string, colId: Id) => void;
}) {
  const ref = useRef<HTMLTextAreaElement | null>(null);

  useOutsideClick(ref, () => {
    if (setTempTask && generateTask && tempTask && colId) {
      generateTask(tempTask?.taskName, colId)
      setTempTask(undefined);
    }
  });

  if (tempTask === undefined) {
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (setTempTask && colId) {
            setTempTask({colId: colId, taskName: ""});
          }
        }}
        className=" shrink-0 w-full min-h-8 pl-2 mt-2  flex gap-2 items-center  rounded-md hover:bg-black/20 active:bg-black/40 shadow-md active:shadow-sm"
      >
        <AddIcon className="size-4"></AddIcon> Add Task
      </button>
    );
  } else {
    return (
      <textarea
        ref={ref}
        value={tempTask.taskName}
        onKeyDown={(e) => {
          if (e.key === "Enter" && generateTask && colId) {
            e.preventDefault();
            generateTask(tempTask.taskName, colId);
          }
        }}
        onChange={(e) => {
          if (setTempTask) setTempTask((prev) => {
            if (!prev) return prev;
            return {...prev, taskName: e.target.value}
          });
        }}
        className="shrink-0 w-full bg-neutral-50 min-h-8 max-h-32 mt-2 pl-2 pr-4 pb-4 pt-2 resize-none focus:outline-none rounded-md shadow-md
         [&::-webkit-scrollbar]:rounded-md
         [&::-webkit-scrollbar]:w-3
          [&::-webkit-scrollbar-track]:rounded-md
          [&::-webkit-scrollbar-track]:bg-zinc-100
           [&::-webkit-scrollbar-thumb]:rounded-md
         [&::-webkit-scrollbar-thumb]:bg-zinc-400
         "
        autoFocus
      ></textarea>
    );
  }
}
