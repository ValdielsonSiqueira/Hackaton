import type { TaskRepository, SettingsRepository } from "@seniorease/core";
import { ManageTasks, ManageSettings } from "@seniorease/core";
import { 
  AsyncStorageTaskRepository, 
  AsyncStorageSettingsRepository 
} from "../../data/AsyncStorageRepositories";
import { 
  type UserProfileRepository, 
  AsyncStorageUserProfileRepository 
} from "../../data/AsyncStorageUserProfileRepository";
import { 
  type ActivityRepository, 
  AsyncStorageActivityRepository 
} from "../../data/AsyncStorageActivityRepository";
import { 
  type AuthRepository, 
  AsyncStorageAuthRepository 
} from "../../data/AsyncStorageAuthRepository";
import { AuthUseCases } from "../../modules/auth/index";
import { type IVoiceService, ExpoSpeechVoiceService } from "../../services/voiceService";

export interface IDIContainer {
  taskRepository: TaskRepository;
  settingsRepository: SettingsRepository;
  userProfileRepository: UserProfileRepository;
  activityRepository: ActivityRepository;
  authRepository: AuthRepository;

  manageTasksUseCase: ManageTasks;
  manageSettingsUseCase: ManageSettings;
  authUseCases: AuthUseCases;

  voiceService: IVoiceService;
}

class DIContainer implements IDIContainer {
  private static instance: DIContainer;

  public taskRepository: TaskRepository;
  public settingsRepository: SettingsRepository;
  public userProfileRepository: UserProfileRepository;
  public activityRepository: ActivityRepository;
  public authRepository: AuthRepository;

  public manageTasksUseCase: ManageTasks;
  public manageSettingsUseCase: ManageSettings;
  public authUseCases: AuthUseCases;

  public voiceService: IVoiceService;

  private constructor() {
    this.taskRepository = new AsyncStorageTaskRepository();
    this.settingsRepository = new AsyncStorageSettingsRepository();
    this.userProfileRepository = new AsyncStorageUserProfileRepository();
    this.activityRepository = new AsyncStorageActivityRepository();
    this.authRepository = new AsyncStorageAuthRepository();

    this.manageTasksUseCase = new ManageTasks(this.taskRepository);
    this.manageSettingsUseCase = new ManageSettings(this.settingsRepository);
    this.authUseCases = new AuthUseCases(this.authRepository);

    this.voiceService = new ExpoSpeechVoiceService();
  }

  public static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  public overrideDependencies(overrides: Partial<IDIContainer>): void {
    Object.assign(this, overrides);

    if (overrides.taskRepository) {
      this.manageTasksUseCase = new ManageTasks(this.taskRepository);
    }
    if (overrides.settingsRepository) {
      this.manageSettingsUseCase = new ManageSettings(this.settingsRepository);
    }
    if (overrides.authRepository) {
      this.authUseCases = new AuthUseCases(this.authRepository);
    }
  }
}

export const container = DIContainer.getInstance();
