export enum AppLoadingStage {
  GoToChat = '初始化完成',
  Initializing = '项目初始化中',
}

export const SERVER_LOADING_STAGES = [
  AppLoadingStage.Initializing,
  AppLoadingStage.GoToChat,
];
