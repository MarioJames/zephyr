'use client';

import { useOIDC } from '@/contexts/OIDCContext';

export function TokenInfo() {
  const { accessToken, refreshToken, refreshAccessToken, isLoading } =
    useOIDC();

  if (!accessToken && !refreshToken) {
    return null;
  }

  return (
    <div className='mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg w-full max-w-2xl'>
      <h2 className='text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>
        Token 信息
      </h2>

      <div className='space-y-4'>
        <div>
          <h3 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
            Access Token
          </h3>
          <div className='bg-white dark:bg-gray-700 p-2 rounded border border-gray-200 dark:border-gray-600 overflow-auto'>
            <code className='text-xs break-all text-gray-800 dark:text-gray-200'>
              {accessToken}
            </code>
          </div>
        </div>

        <div>
          <h3 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
            Refresh Token
          </h3>
          <div className='bg-white dark:bg-gray-700 p-2 rounded border border-gray-200 dark:border-gray-600 overflow-auto'>
            <code className='text-xs break-all text-gray-800 dark:text-gray-200'>
              {refreshToken}
            </code>
          </div>
        </div>

        <button
          onClick={() => refreshAccessToken()}
          disabled={isLoading}
          className={`px-4 py-2 rounded-md text-white ${
            isLoading
              ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700'
          } transition-colors`}
        >
          {isLoading ? '刷新中...' : '刷新 Access Token'}
        </button>
      </div>
    </div>
  );
}
