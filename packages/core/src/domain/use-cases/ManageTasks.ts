import { Task } from "../entities/Task.js";
import { TaskRepository } from "../repositories/TaskRepository.js";

export class ManageTasks {
  constructor(private taskRepo: TaskRepository) {}

  async listTasks(): Promise<Task[]> {
    return this.taskRepo.getTasks();
  }

  async createTask(title: string, description: string, instructions: string[]): Promise<Task> {
    const task: Task = {
      id: Math.random().toString(36).substring(7),
      title,
      description,
      steps: instructions.map((ins, index) => ({
        id: index.toString(),
        instruction: ins,
        isCompleted: false
      })),
      isCompleted: false,
      createdAt: new Date().toISOString()
    };
    await this.taskRepo.saveTask(task);
    return task;
  }

  async toggleStep(taskId: string, stepId: string): Promise<Task | null> {
    const tasks = await this.taskRepo.getTasks();
    const task = tasks.find(t => t.id === taskId);
    if (!task) return null;

    const step = task.steps.find(s => s.id === stepId);
    if (step) {
      step.isCompleted = !step.isCompleted;
    }

    task.isCompleted = task.steps.every(s => s.isCompleted);
    await this.taskRepo.saveTask(task);
    return task;
  }

  async toggleTaskCompletion(taskId: string): Promise<Task | null> {
    const tasks = await this.taskRepo.getTasks();
    const task = tasks.find(t => t.id === taskId);
    if (!task) return null;

    task.isCompleted = !task.isCompleted;
    task.steps.forEach(s => {
      s.isCompleted = task.isCompleted;
    });
    await this.taskRepo.saveTask(task);
    return task;
  }

  async deleteTask(taskId: string): Promise<void> {
    await this.taskRepo.deleteTask(taskId);
  }
}
