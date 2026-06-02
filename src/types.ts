export type Id = string | number;

export type Column = {
    id: Id,
    name: string,
    rank: string
}

export type DraftTask = {
    taskName: string,
    colId: Id
}

export type Task = DraftTask & {
    id: Id,
    rank: string
}