import AsyncStorage from "@react-native-async-storage/async-storage";

export interface RegisteredUser {
  name: string;
  email: string;
  password?: string;
}

export interface AuthRepository {
  saveUser(user: RegisteredUser): Promise<void>;
  getUserByEmail(email: string): Promise<RegisteredUser | null>;
}

export class AsyncStorageAuthRepository implements AuthRepository {
  private STORAGE_KEY = "seniorease_users";

  async saveUser(user: RegisteredUser): Promise<void> {
    try {
      const raw = await AsyncStorage.getItem(this.STORAGE_KEY);
      const users = raw ? JSON.parse(raw) : {};
      users[user.email.toLowerCase()] = user;
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
    } catch (err) {}
  }

  async getUserByEmail(email: string): Promise<RegisteredUser | null> {
    try {
      const raw = await AsyncStorage.getItem(this.STORAGE_KEY);
      const users = raw ? JSON.parse(raw) : {};
      const lowerEmail = email.toLowerCase();

      if (users[lowerEmail]) {
        return users[lowerEmail];
      }

      if (lowerEmail === "estudante@fiap.com.br" || lowerEmail === "joao@exemplo.com") {
        return {
          name: "Estudante FIAP",
          email: lowerEmail,
        };
      }

      return null;
    } catch (err) {
      return null;
    }
  }
}
