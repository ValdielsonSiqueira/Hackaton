export interface RegisteredUser {
  name: string;
  email: string;
  password?: string;
}

export interface AuthRepository {
  saveUser(user: RegisteredUser): Promise<void>;
  getUserByEmail(email: string): Promise<RegisteredUser | null>;
}

export class LocalStorageAuthRepository implements AuthRepository {
  private STORAGE_KEY = "seniorease_users";

  async saveUser(user: RegisteredUser): Promise<void> {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      const users = raw ? JSON.parse(raw) : {};
      users[user.email.toLowerCase()] = user;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
    } catch (err) {}
  }

  async getUserByEmail(email: string): Promise<RegisteredUser | null> {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return null;
      const users = JSON.parse(raw);
      return users[email.toLowerCase()] || null;
    } catch (err) {
      return null;
    }
  }
}
