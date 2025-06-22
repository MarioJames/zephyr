// 导入同步相关类型
import { PeerSyncStatus, SyncAwarenessState } from '@/types/sync'; // 同步状态类型

/**
 * 用户同步状态接口
 * 定义了用户数据同步相关的状态字段
 */
export interface UserSyncState {
  /**
   * 同步感知状态列表
   * 存储所有同步感知的状态信息
   * 用于跟踪多设备间的同步状态
   */
  syncAwareness: SyncAwarenessState[];
  
  /**
   * 是否启用同步功能
   * 控制用户数据是否在多设备间同步
   */
  syncEnabled: boolean;
  
  /**
   * 同步状态
   * 当前的对等同步状态
   * 可以是启用、禁用、连接中等状态
   */
  syncStatus: PeerSyncStatus;
}

/**
 * 用户同步状态的初始值
 * 设置所有同步相关字段的默认值
 */
export const initialSyncState: UserSyncState = {
  syncAwareness: [], // 默认同步感知列表为空
  syncEnabled: false, // 默认不启用同步
  syncStatus: PeerSyncStatus.Disabled, // 默认同步状态为禁用
};
