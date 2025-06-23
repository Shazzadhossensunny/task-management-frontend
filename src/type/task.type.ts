// src/types/task.ts

export type TTaskCategory =
  | "arts-crafts"
  | "nature"
  | "family"
  | "sport"
  | "friends"
  | "meditation";

export type TTaskStatus =
  | "pending"
  | "inprogress"
  | "done"
  | "collaborativeTask";

export interface ITask {
  _id: string;
  title: string;
  description: string;
  category: TTaskCategory;
  status: TTaskStatus;
  userId: string;
  dueDate?: string;
  points: number;
  createdAt: string;
  updatedAt: string;
}

export interface ITaskCreate {
  title: string;
  description: string;
  category: TTaskCategory;
  dueDate?: string;
  points?: number;
}
