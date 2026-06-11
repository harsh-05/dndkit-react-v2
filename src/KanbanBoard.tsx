import { useEffect, useRef, useState } from "react";
import { AddColumn } from "./AddColumn";
import type { Column, DraftTask, Id, Task } from "./types";
import {
  DragDropProvider,
  DragOverlay,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/react";
import { generateKeyBetween } from "fractional-indexing";
import { ColumnCard, ColumnCardPreview } from "./ColumnCard";
import { isSortable } from "@dnd-kit/react/sortable";
import { TaskCardPreview } from "./TaskCard";

export function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tempTask, setTempTask] = useState<DraftTask>();
  const [activeTaskId, setActiveTaskId] = useState<Id | null>(null);
  const tasksSnapshot = useRef<Task[]>([]);

  const generateColumn = (name: string) => {
    const id = crypto.randomUUID();
    setColumns((prev) => {
      const cols = [...prev].sort((a, b) =>
        a.rank < b.rank ? -1 : a.rank > b.rank ? 1 : 0,
      );
      const lastTask = cols[cols.length - 1];
      const rank = generateKeyBetween(lastTask?.rank ?? null, null);
      return [...prev, { id, name, rank }];
    });
  };

  const generateTask = (taskName: string, colId: Id) => {
    if (taskName === "" || colId === "") {
      setTempTask(undefined);
      return;
    }
    const id = crypto.randomUUID();
    setTasks((prev) => {
      const colTasks = [...prev]
        .filter((task) => task.colId === colId)
        .sort((a, b) => (a.rank < b.rank ? -1 : a.rank > b.rank ? 1 : 0));

      const newRank = generateKeyBetween(
        colTasks[colTasks.length - 1]?.rank ?? null,
        null,
      );

      return [...prev, { id, taskName, colId, rank: newRank }];
    });
  };

  const sortedColumns = [...columns].sort((a, b) =>
    a.rank < b.rank ? -1 : a.rank > b.rank ? 1 : 0,
  );

  useEffect(() => {
    console.log(columns[columns.length - 1]?.rank);
  }, [columns]);

  useEffect(() => {
    console.log(tasks[tasks.length - 1]?.rank);
  }, [tasks]);

  return (
    <div className="flex items-start gap-2 h-full overflow-x-auto">
      <DragDropProvider
        onDragEnd={handledragEnd}
        onDragOver={handleDragOver}
        onDragStart={handleDragStart}
      >
        {sortedColumns.map((cols: Column, ind) => {
          return (
            <ColumnCard
              tempTask={cols.id === tempTask?.colId ? tempTask : undefined}
              setTempTask={setTempTask}
              col={cols}
              index={ind}
              key={cols.id}
              generateTask={generateTask}
              tasks={tasks.filter((task) => task.colId === cols.id)}
              preserveTaskOrder={activeTaskId !== null}
            />
          );
        })}

        <DragOverlay>
          {(source) => {
            if (source && source.type === "column")
              return (
                <ColumnCardPreview
                  tempTask={tempTask}
                  col={source.data.column}
                  tasks={tasks.filter((task) => task.colId === source.id)}
                ></ColumnCardPreview>
              );
            if (source && source.type === "task")
              return <TaskCardPreview task={source.data.task} />;
            return null;
          }}
        </DragOverlay>
      </DragDropProvider>
      <AddColumn generateColumn={generateColumn}></AddColumn>
    </div>
  );

  function handleDragStart(event: DragStartEvent) {
    const source = event.operation.source;

    if (!isSortable(source) || source.type != "task") return;
    setActiveTaskId(source.id);
    setTasks((prev) => {
      const sortedTasks = [...prev].sort((a, b) =>
        a.rank < b.rank ? -1 : a.rank > b.rank ? 1 : 0,
      );

      tasksSnapshot.current = sortedTasks;
      return sortedTasks;
    });
  }

  function handleDragOver(event: DragOverEvent) {
    const source = event.operation.source;
    const target = event.operation.target;

    if (!isSortable(source) || !target || !source || !isSortable(target))
      return;
    if (source.type !== "task") return;
    if (target.type === "column" || target.type === "task") {
      event.preventDefault();
      setTasks((prev) => {
        const task = prev.find((item) => item.id === source.id);
        if (!task) return prev;

        const targetColId = target.type === "task" ? target.group : target.id;
        if (targetColId == null) return prev;
        const tasksWithoutSource = prev.filter((item) => item.id !== source.id);
        const colTasks = tasksWithoutSource.filter(
          (item) => item.colId === targetColId,
        );
        const targetIndex =
          target.type === "column"
            ? colTasks.length
            : Math.max(0, Math.min(target.index, colTasks.length));
        const targetTask = colTasks[targetIndex];
        const lastTask = colTasks[colTasks.length - 1];
        const insertIndex = targetTask
          ? tasksWithoutSource.findIndex((item) => item.id === targetTask.id)
          : lastTask
            ? tasksWithoutSource.findIndex((item) => item.id === lastTask.id) +
              1
            : tasksWithoutSource.length;

        const updatedTasks = [...tasksWithoutSource];
        updatedTasks.splice(insertIndex, 0, { ...task, colId: targetColId });
        return updatedTasks;
      });
    }

    console.log("Initial Group" + source.initialGroup);
    console.log("Group" + source.group);
    console.log(source.initialGroup === source.group);
    console.log("Initial Index" + source.initialIndex);
    console.log(" Index" + source.index);

    console.log(
      "<-----------------------------------Target------------------------------->",
    );

    if (isSortable(target)) {
      console.log("Target Index", target.index);
      console.log("Target Group", target.group);
      console.log("target Type", target.type);
      console.log("Target Id", target.id);
      console.log("Target Data", target.data);
    }
  }

  function handledragEnd(event: DragEndEvent) {
    const source = event.operation.source;
    if (!isSortable(source)) {
      if (activeTaskId !== null && event.canceled) {
        setTasks(tasksSnapshot.current);
      }
      setActiveTaskId(null);
      return;
    }
    const { index, initialIndex } = source;
    // console.log(index);
    // console.log(initialIndex);
    // console.log(data);

    //Handling the Column Sorting/ Reordering, needs thorough testing  .....
    if (source.type === "column") {
      setColumns((prev) => {
        const sortedColumns = [...prev].sort((a, b) =>
          a.rank < b.rank ? -1 : a.rank > b.rank ? 1 : 0,
        );

        let beforeRank = null;
        let afterRank = null;
        if (initialIndex === index) return prev;
        if (initialIndex < index) {
          beforeRank = sortedColumns[index]?.rank ?? null;
          afterRank =
            index < sortedColumns.length - 1
              ? sortedColumns[index + 1]?.rank
              : null;
        }
        if (initialIndex > index) {
          beforeRank = index > 0 ? sortedColumns[index - 1].rank : null;
          afterRank = sortedColumns[index].rank;
        }

        const newRank = generateKeyBetween(beforeRank, afterRank);

        const colIdx = prev.findIndex((c) => c.id === source.id);
        if (colIdx === -1) return prev;

        const updated = [...prev];
        updated[colIdx] = { ...updated[colIdx], rank: newRank };
        return updated;
      });
    }

    if (source.type === "task") {
      setActiveTaskId(null);

      if (event.canceled) {
        setTasks(tasksSnapshot.current);
        return;
      }

      setTasks((prev) => {
        const currentTask = prev.find((task) => task.id === source.id);
        const initialTask = tasksSnapshot.current.find(
          (task) => task.id === source.id,
        );
        if (!currentTask || !initialTask) return prev;

        const sortedTask = prev.filter(
          (task) => task.colId === currentTask.colId,
        );
        const initialSortedTask = tasksSnapshot.current.filter(
          (task) => task.colId === initialTask.colId,
        );
        const taskIndex = sortedTask.findIndex((task) => task.id === source.id);
        const initialTaskIndex = initialSortedTask.findIndex(
          (task) => task.id === source.id,
        );
        if (taskIndex === -1) return prev;
        if (
          initialTask.colId === currentTask.colId &&
          initialTaskIndex === taskIndex
        )
          return prev;

        const beforeRank = sortedTask[taskIndex - 1]?.rank ?? null;
        const afterRank = sortedTask[taskIndex + 1]?.rank ?? null;
        const newRank = generateKeyBetween(beforeRank, afterRank);
        const updatedTasks = [...prev].map((task) =>
          task.id === source.id ? { ...task, rank: newRank } : task,
        );
        [...updatedTasks]
          .filter((task) => task.colId === currentTask.colId)
          .sort((a, b) => (a.rank < b.rank ? -1 : a.rank > b.rank ? 1 : 0))
          .map((task) => console.log(task));

        return updatedTasks;
      });

    }
  }
}
