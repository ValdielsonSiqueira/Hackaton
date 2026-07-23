export interface TaskStep {
  id: string;
  instruction: string;
  isCompleted: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  steps: TaskStep[];
  isCompleted: boolean;
  createdAt: string;
}
