import type { TaskRepository, SettingsRepository } from "@seniorease/core";
import { ManageTasks, ManageSettings } from "@seniorease/core";
import { 
  LocalStorageTaskRepository, 
  LocalStorageSettingsRepository 
} from "../../data/LocalStorageRepositories";
import { 
  type UserProfileRepository, 
  LocalStorageUserProfileRepository 
} from "../../data/LocalStorageUserProfileRepository";
import { 
  type ActivityRepository, 
  LocalStorageActivityRepository 
} from "../../data/LocalStorageActivityRepository";
import { 
  type AuthRepository, 
  LocalStorageAuthRepository 
} from "../../data/LocalStorageAuthRepository";
import { AuthUseCases } from "../../modules/auth/index";
import { VoiceService } from "../../services/voiceService";
import * as speechService from "../../services/speech";

export interface IDIContainer {
  taskRepository: TaskRepository;
  settingsRepository: SettingsRepository;
  userProfileRepository: UserProfileRepository;
  activityRepository: ActivityRepository;
  authRepository: AuthRepository;

  manageTasksUseCase: ManageTasks;
  manageSettingsUseCase: ManageSettings;
  authUseCases: AuthUseCases;

  voiceService: VoiceService;
  speechService: typeof speechService;
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

  public voiceService: VoiceService;
  public speechService: typeof speechService;

  private constructor() {
    this.taskRepository = new LocalStorageTaskRepository();
    this.settingsRepository = new LocalStorageSettingsRepository();
    this.userProfileRepository = new LocalStorageUserProfileRepository();
    this.activityRepository = new LocalStorageActivityRepository();
    this.authRepository = new LocalStorageAuthRepository();

    this.manageTasksUseCase = new ManageTasks(this.taskRepository);
    this.manageSettingsUseCase = new ManageSettings(this.settingsRepository);
    this.authUseCases = new AuthUseCases(this.authRepository);

    this.voiceService = new VoiceService();
    this.speechService = speechService;
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
