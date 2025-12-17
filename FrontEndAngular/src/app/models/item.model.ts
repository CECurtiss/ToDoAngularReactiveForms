export interface Item {
    id: number;
    priority: string;
    task: string;
    dueDate: Date|null;
    completed: boolean;
    dateCompleted? : Date;
}