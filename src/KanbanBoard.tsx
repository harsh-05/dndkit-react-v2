import { useState } from "react";
import { AddColumn } from "./AddColumn";
import type { Column } from "./types";

export function KanbanBoard() {
    const [columns, setColumns] = useState<Column[]>([]);
    
    const generateColumn = (name:string) => {
            
    }

    return (
        <div className="flex items-start gap-2 h-full overflow-x-auto">
            
            <AddColumn generateColumn={generateColumn}  ></AddColumn>

      </div>
    );
}