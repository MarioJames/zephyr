# OIDC Store 使用示例

重构后的OIDC store提供了更好的类型安全和模块化架构。

## 基础使用

```typescript
import { useOIDCStore, oidcSelectors } from '@/store/oidc';

function MyComponent() {
  // 使用整个store
  const { 
    isAuthenticated, 
    user, 
    userInfo, 
    login, 
    logout,
    isLoading,
    error 
  } = useOIDCStore();

  // 或使用选择器优化性能
  const isReady = useOIDCStore(oidcSelectors.isFullyReady);
  const userIdentity = useOIDCStore(oidcSelectors.userIdentity);
  
  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>欢迎, {userIdentity.name}</p>
          <button onClick={logout}>登出</button>
        </div>
      ) : (
        <button onClick={login}>登录</button>
      )}
    </div>
  );
}
```

## 选择器使用

```typescript
import { useOIDCStore, oidcAuthSelectors, oidcTokenSelectors, oidcUserSelectors } from '@/store/oidc';

function AuthStatus() {
  // 认证状态选择器
  const isAuthenticated = useOIDCStore(oidcAuthSelectors.isAuthenticated);
  const userName = useOIDCStore(oidcAuthSelectors.userName);
  
  // Token状态选择器
  const hasValidToken = useOIDCStore(oidcTokenSelectors.hasValidToken);
  const timeUntilExpiry = useOIDCStore(oidcTokenSelectors.timeUntilExpiry);
  
  // 用户信息选择器
  const userInfo = useOIDCStore(oidcUserSelectors.userInfo);
  const isLoadingUserInfo = useOIDCStore(oidcUserSelectors.isLoadingUserInfo);
  
  return (
    <div>
      <p>认证状态: {isAuthenticated ? '已认证' : '未认证'}</p>
      <p>Token有效: {hasValidToken ? '是' : '否'}</p>
      <p>Token过期时间: {timeUntilExpiry}秒</p>
      <p>用户信息: {isLoadingUserInfo ? '加载中...' : userInfo?.name}</p>
    </div>
  );
}
```

## 高级功能

```typescript
import { getOIDCStoreState } from '@/store/oidc';

// 在非React组件中使用
async function makeAuthenticatedRequest() {
  const { getValidAccessToken } = getOIDCStoreState();
  const token = await getValidAccessToken();
  
  if (token) {
    // 使用token进行API调用
    return fetch('/api/data', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
}
```

## 架构优势

1. **模块化**: 按功能划分slice (auth, token, user)
2. **类型安全**: 完整的TypeScript类型定义
3. **性能优化**: 精确的选择器避免不必要的重渲染
4. **开发工具**: 集成Redux DevTools支持
5. **持久化**: 自动保存关键状态到localStorage
6. **一致性**: 遵循项目其他store模块的架构模式