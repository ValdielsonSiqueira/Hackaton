import type { AuthRepository, RegisteredUser } from "../../../data/LocalStorageAuthRepository";

export type AuthResult = 
  | { success: true; user: RegisteredUser }
  | { success: false; errorCode: "USER_NOT_FOUND" | "WRONG_PASSWORD" };

export class AuthUseCases {
  private repository: AuthRepository;

  constructor(repository: AuthRepository) {
    this.repository = repository;
  }

  async register(name: string, email: string, password?: string): Promise<RegisteredUser> {
    const user: RegisteredUser = { name, email: email.toLowerCase(), password };
    await this.repository.saveUser(user);
    return user;
  }

  async login(email: string, password?: string): Promise<AuthResult> {
    const user = await this.repository.getUserByEmail(email);
    if (!user) {
      return { success: false, errorCode: "USER_NOT_FOUND" };
    }
    if (user.password && user.password !== password) {
      return { success: false, errorCode: "WRONG_PASSWORD" };
    }
    return { success: true, user };
  }
}
