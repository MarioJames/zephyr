'use client';

import { LoginButton } from './components/LoginButton';
import { TokenInfo } from './components/TokenInfo';
import { useOIDC } from './contexts/OIDCContext';

export default function Home() {
  const { user } = useOIDC();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">OIDC 认证示例</h1>
        <LoginButton />
        {user && (
          <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">用户信息</h2>
            <pre className="text-sm overflow-auto text-gray-800 dark:text-gray-200">
              {JSON.stringify(user.profile, null, 2)}
            </pre>
          </div>
        )}
        <TokenInfo />
      </div>
    </div>
  );
}
