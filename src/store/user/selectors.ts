/**
 * 用户Store选择器导出文件
 * 集中导出所有slice中的选择器，方便在组件中使用
 */

// 导出认证相关选择器
export { authSelectors, userProfileSelectors } from './slices/auth/selectors';

// 导出模型列表相关选择器
export {
  keyVaultsConfigSelectors, // 密钥库配置选择器
  modelConfigSelectors, // 模型配置选择器
  modelProviderSelectors, // 模型提供商选择器
} from './slices/modelList/selectors';

// 导出偏好设置选择器
export { preferenceSelectors } from './slices/preference/selectors';

// 导出用户设置相关选择器
export {
  settingsSelectors, // 通用设置选择器
  systemAgentSelectors, // 系统代理选择器
  userGeneralSettingsSelectors, // 用户通用设置选择器
} from './slices/settings/selectors';

// 导出同步设置选择器
export { syncSettingsSelectors } from './slices/sync/selectors';
