import { SessionItem } from '@/services/sessions';

// 会话辅助函数
export const sessionHelpers = {
  // 格式化会话标题
  formatSessionTitle: (session: SessionItem): string => {
    return session.title || session.slug || `会话 ${session.id}`;
  },

  // 检查会话是否为空
  isEmptySession: (session: SessionItem): boolean => {
    return !session.title && !session.description;
  },

  // 检查会话是否已置顶
  isPinned: (session: SessionItem): boolean => {
    return !!session.pinned;
  },

  // 获取会话显示名称
  getDisplayName: (session: SessionItem): string => {
    if (session.title) return session.title;
    if (session.slug) return session.slug;
    return `会话 ${session.id.slice(0, 8)}`;
  },

  // 获取会话类型标签
  getTypeLabel: (session: SessionItem): string => {
    switch (session.type) {
      case 'agent':
        return '智能体';
      case 'group':
        return '群组';
      default:
        return '普通';
    }
  },

  // 生成会话摘要
  generateSummary: (session: SessionItem): string => {
    const parts: string[] = [];

    if (session.type) {
      parts.push(sessionHelpers.getTypeLabel(session));
    }

    if (session.description) {
      parts.push(session.description.slice(0, 50) + (session.description.length > 50 ? '...' : ''));
    }

    return parts.join(' • ') || '暂无描述';
  },

  // 检查会话是否匹配搜索关键词
  matchesKeyword: (session: SessionItem, keyword: string): boolean => {
    if (!keyword) return true;

    const searchText = keyword.toLowerCase();
    const sessionText = [
      session.title,
      session.description,
      session.slug,
    ].filter(Boolean).join(' ').toLowerCase();

    return sessionText.includes(searchText);
  },

  // 排序会话列表
  sortSessions: (sessions: SessionItem[], sortBy: 'title' | 'updatedAt' | 'createdAt' = 'updatedAt'): SessionItem[] => {
    return [...sessions].sort((a, b) => {
      switch (sortBy) {
        case 'title':
          const titleA = sessionHelpers.getDisplayName(a);
          const titleB = sessionHelpers.getDisplayName(b);
          return titleA.localeCompare(titleB);

        case 'createdAt':
          const createdA = new Date(a.createdAt || 0).getTime();
          const createdB = new Date(b.createdAt || 0).getTime();
          return createdB - createdA; // 最新的在前

        case 'updatedAt':
        default:
          const updatedA = new Date(a.updatedAt || 0).getTime();
          const updatedB = new Date(b.updatedAt || 0).getTime();
          return updatedB - updatedA; // 最新的在前
      }
    });
  },

  // 过滤会话列表
  filterSessions: (sessions: SessionItem[], filters: {
    type?: 'agent' | 'group';
    pinned?: boolean;
    userId?: string;
    groupId?: string;
  }): SessionItem[] => {
    return sessions.filter(session => {
      if (filters.type && session.type !== filters.type) return false;
      if (filters.pinned !== undefined && !!session.pinned !== filters.pinned) return false;
      if (filters.userId && session.userId !== filters.userId) return false;
      if (filters.groupId && session.groupId !== filters.groupId) return false;
      return true;
    });
  },

  // 检查会话是否为收件箱
  isInboxSession: (sessionId: string): boolean => {
    return sessionId === 'inbox';
  },

  // 格式化时间显示
  formatTime: (dateString?: string): string => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else if (diffDays === 1) {
      return '昨天';
    } else if (diffDays < 7) {
      return `${diffDays}天前`;
    } else {
      return date.toLocaleDateString('zh-CN');
    }
  },

  // 生成会话颜色
  getSessionColor: (session: SessionItem): string => {
    if (session.backgroundColor) return session.backgroundColor;

    // 基于会话ID生成一致的颜色
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
      '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'
    ];

    const hash = session.id.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + acc;
    }, 0);

    return colors[hash % colors.length];
  },
};
