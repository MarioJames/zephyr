import { useOIDC } from '@/contexts/OIDCContext';

export function LoginButton() {
  const { user, isLoading, error, login, logout } = useOIDC();

  if (isLoading) {
    return (
      <button
        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md cursor-not-allowed"
        disabled
      >
        加载中...
      </button>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 dark:text-red-400">
        错误: {error.message}
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {user.profile.name || user.profile.email || '已登录用户'}
        </span>
        <button
          onClick={() => logout()}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-md transition-colors"
        >
          退出登录
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => login()}
      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-md transition-colors"
    >
      登录
    </button>
  );
}
