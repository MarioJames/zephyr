export enum AppLoadingStage {
  GoToChat = '初始化完成',
  InitializingRoles = '初始化角色',
  InitializingAgents = '初始化智能体',
  Initializing = '项目初始化中',
}

export const SERVER_LOADING_STAGES = [
  AppLoadingStage.Initializing,
  AppLoadingStage.InitializingRoles,
  AppLoadingStage.InitializingAgents,
  AppLoadingStage.GoToChat,
];
