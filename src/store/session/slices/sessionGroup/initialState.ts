// 导入会话分组相关的类型定义
import { CustomSessionGroup, LobeSessionGroups } from '@/types/session'; // 自定义会话分组和会话分组类型

/**
 * 会话分组状态接口
 * 定义了会话分组相关的所有状态字段
 */
export interface SessionGroupState {
  /**
   * 当前活动的分组ID
   * 表示当前选中的会话分组
   */
  activeGroupId?: string;
  
  /**
   * 自定义会话分组列表
   * 包含用户创建的自定义会话分组
   */
  customSessionGroups: CustomSessionGroup[];
  
  /**
   * 会话分组列表
   * 包含所有会话分组，包括系统默认和用户自定义的
   */
  sessionGroups: LobeSessionGroups;
}

/**
 * 会话分组状态的初始值
 * 设置所有会话分组相关字段的默认值
 */
export const initSessionGroupState: SessionGroupState = {
  customSessionGroups: [], // 默认自定义分组为空
  sessionGroups: [], // 默认会话分组列表为空
};
