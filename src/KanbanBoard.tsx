import { useEffect, useState } from "react";
import { AddColumn } from "./AddColumn";
import type { Column, DraftTask, Id, Task } from "./types";
import {
  DragDropProvider,
  DragOverlay,
  type DragEndEvent,
} from "@dnd-kit/react";
import { generateKeyBetween } from "fractional-indexing";
import { ColumnCard, ColumnCardPreview } from "./ColumnCard";
import { isSortable } from "@dnd-kit/react/sortable";

export function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tempTask, setTempTask] = useState<DraftTask>();

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
    if (taskName === '' || colId === '') throw new Error("Either no taskname or column Id !!!!");
    const id = crypto.randomUUID();
    setTasks((prev) => {
          const colTasks = [...prev]
            .filter((task) => task.colId === colId)
        .sort((a, b) => (a.rank < b.rank ? -1 : a.rank > b.rank ? 1 : 0));
      
      const newRank = generateKeyBetween(colTasks[colTasks.length-1]?.rank ?? null, null);

      return [...prev, { id, taskName, colId, rank: newRank }];

    })
  } 

  const sortedColumns = [...columns].sort((a, b) =>
    a.rank < b.rank ? -1 : a.rank > b.rank ? 1 : 0,
  );

  useEffect(() => {
    console.log(columns[columns.length - 1]?.rank);
  }, [columns]);

  useEffect(() => {
    console.log(tasks[tasks.length-1]?.rank);
  }, [tasks]);


  return (
      <div className="flex items-start gap-2 h-full overflow-x-auto">
        <DragDropProvider onDragEnd={handledragEnd}>
          {sortedColumns.map((cols: Column, ind) => {
            return <ColumnCard tempTask={cols.id === tempTask?.colId ? tempTask : undefined} setTempTask={setTempTask} col={cols} index={ind} key={cols.id} generateTask={generateTask} />;
          })}

          <DragOverlay>
            {(source) => {
              if (source && source.type === "column")
              
                return (
                  <ColumnCardPreview tempTask={ tempTask} col={source.data.column}></ColumnCardPreview>
                );
              return null;
            
            }}
          </DragOverlay>
        </DragDropProvider>
        <AddColumn generateColumn={generateColumn}></AddColumn>
      </div>
  );

  function handledragEnd(event: DragEndEvent) {
    const source = event.operation.source;
    if (isSortable(source)) {
      const { index, initialIndex, data } = source;
      console.log(index);
      console.log(initialIndex);
      console.log(data);

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
  }
}
