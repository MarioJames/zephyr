/**
 * 通用状态接口
 * 定义了用户相关的通用状态字段
 */
export interface CommonState {
  /**
   * 是否已完成引导流程
   * 标识用户是否已经完成应用的引导教程
   */
  isOnboard: boolean;
  
  /**
   * 是否显示PWA引导
   * 控制是否显示渐进式Web应用的安装引导
   */
  isShowPWAGuide: boolean;
  
  /**
   * 用户是否可以启用追踪
   * 标识用户是否有权限启用应用追踪功能
   */
  isUserCanEnableTrace: boolean;
  
  /**
   * 用户是否有对话记录
   * 标识用户是否已经创建过对话
   */
  isUserHasConversation: boolean;
  
  /**
   * 用户状态是否已初始化
   * 标识用户状态是否已经完成初始化加载
   */
  isUserStateInit: boolean;
}

/**
 * 通用状态的初始值
 * 设置所有通用状态字段的默认值
 */
export const initialCommonState: CommonState = {
  isOnboard: false, // 默认未完成引导
  isShowPWAGuide: false, // 默认不显示PWA引导
  isUserCanEnableTrace: false, // 默认不能启用追踪
  isUserHasConversation: false, // 默认没有对话记录
  isUserStateInit: false, // 默认用户状态未初始化
};
