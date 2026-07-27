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
import { VoiceService } from "../../services/voiceService";
import * as speechService from "../../services/speech";

export interface IDIContainer {
  taskRepository: TaskRepository;
  settingsRepository: SettingsRepository;
  userProfileRepository: UserProfileRepository;
  activityRepository: ActivityRepository;

  manageTasksUseCase: ManageTasks;
  manageSettingsUseCase: ManageSettings;

  voiceService: VoiceService;
  speechService: typeof speechService;
}

class DIContainer implements IDIContainer {
  private static instance: DIContainer;

  public taskRepository: TaskRepository;
  public settingsRepository: SettingsRepository;
  public userProfileRepository: UserProfileRepository;
  public activityRepository: ActivityRepository;

  public manageTasksUseCase: ManageTasks;
  public manageSettingsUseCase: ManageSettings;

  public voiceService: VoiceService;
  public speechService: typeof speechService;

  private constructor() {
    this.taskRepository = new LocalStorageTaskRepository();
    this.settingsRepository = new LocalStorageSettingsRepository();
    this.userProfileRepository = new LocalStorageUserProfileRepository();
    this.activityRepository = new LocalStorageActivityRepository();

    this.manageTasksUseCase = new ManageTasks(this.taskRepository);
    this.manageSettingsUseCase = new ManageSettings(this.settingsRepository);

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
  }
}

export const container = DIContainer.getInstance();
