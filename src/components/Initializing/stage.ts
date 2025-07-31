export enum AppLoadingStage {
  GoToChat = '初始化完成',
  Initializing = '项目初始化中',
  InitializingAgents = '初始化智能体',
  InitializingModels = '初始化模型',
  InitializingRoles = '初始化角色'
}

export const SERVER_LOADING_STAGES = [
  AppLoadingStage.Initializing,
  AppLoadingStage.InitializingRoles,
  AppLoadingStage.InitializingAgents,
  AppLoadingStage.InitializingModels,
  AppLoadingStage.GoToChat,
];
