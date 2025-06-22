'use client';

import { useEffect } from 'react';
import { userManager } from '@/config/oidc';
// 移除调试工具导入

export default function SilentCallbackPage() {
  useEffect(() => {
    const handleSilentCallback = async () => {
      console.log('OIDC: Processing silent callback', window.location.href);

      if (!userManager) {
        const error = new Error('OIDC UserManager not initialized for silent callback');
        console.error('OIDC: UserManager not initialized for silent callback');
        return;
      }

      try {
        console.log('OIDC: Processing silent callback');
        const user = await userManager.signinSilentCallback();
        
        console.log('OIDC: Silent callback successful');
        
      } catch (error) {
        console.error('OIDC: Silent callback error', error);
      }
    };

    handleSilentCallback();
  }, []);

  return (
    <div style={{ display: 'none' }}>
      {/* 静默回调页面不显示任何内容 */}
    </div>
  );
}