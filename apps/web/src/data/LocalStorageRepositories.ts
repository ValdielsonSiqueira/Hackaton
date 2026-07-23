import type { Task, TaskRepository, UserSettings, SettingsRepository } from "@seniorease/core";

export class LocalStorageTaskRepository implements TaskRepository {
  private STORAGE_KEY = "seniorease_tasks";

  async getTasks(): Promise<Task[]> {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  async saveTask(task: Task): Promise<void> {
    const tasks = await this.getTasks();
    const index = tasks.findIndex(t => t.id === task.id);
    if (index > -1) {
      tasks[index] = task;
    } else {
      tasks.push(task);
    }
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
  }

  async deleteTask(id: string): Promise<void> {
    const tasks = await this.getTasks();
    const filtered = tasks.filter(t => t.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
  }
}

export class LocalStorageSettingsRepository implements SettingsRepository {
  private STORAGE_KEY = "seniorease_settings";

  async getSettings(): Promise<UserSettings | null> {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  async saveSettings(settings: UserSettings): Promise<void> {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
  }
}
