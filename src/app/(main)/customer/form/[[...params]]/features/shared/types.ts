import { AgentItem } from '@/services/agents';

// Header 组件接口
export interface HeaderProps {
  onCancel: () => void;
}

// 客户类型选择器接口
export interface CustomerTypeSelectorProps {
  agents: AgentItem[];
}

// 头像上传器接口
export interface AvatarUploaderProps {
  disabled?: boolean;
}

// 表单操作按钮接口
export interface FormActionsProps {
  mode: 'create' | 'edit';
  submitting?: boolean;
  onCancel: () => void;
}
