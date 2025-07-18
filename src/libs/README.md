# 阿里云邮件推送服务集成

本项目已集成阿里云邮件推送服务（DirectMail），采用清晰的分层架构，支持 SMTP 方式发送邮件。

## 架构设计

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   services/mail │    │   app/api/mail  │
│   (React 组件)  │───▶│   (HTTP 调用)   │───▶│   (业务逻辑)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                                                       ▼
                                               ┌─────────────────┐
                                               │ libs/aliyun-mail│
                                               │   (SMTP 封装)   │
                                               └─────────────────┘
```

## 功能特性

- ✅ 清晰的分层架构，客户端可安全使用
- ✅ 支持单发、批量发送和系统通知
- ✅ 内置邮件模板（欢迎、密码重置、账户验证、系统警报）
- ✅ 完整的 TypeScript 类型支持
- ✅ 统一的错误处理和响应格式
- ✅ 便捷的 API 调用封装

## 环境配置

在 `.env` 文件中配置以下环境变量：

```env
# 阿里云邮件推送服务配置
ALIYUN_MAIL_SMTP_HOST=smtpdm.aliyun.com
ALIYUN_MAIL_SMTP_PORT=25
ALIYUN_MAIL_SMTP_SECURE=false
ALIYUN_MAIL_SMTP_USER=your-email@your-domain.com
ALIYUN_MAIL_SMTP_PASS=your-smtp-password

# 应用配置
APP_NAME=保险客户管理系统
APP_URL=http://localhost:3000
ALIYUN_MAIL_DEFAULT_FROM=noreply@your-domain.com
```

## 使用方法

### 1. 在前端组件中使用

```typescript
import { mailAPI } from '@/services';

export default function EmailSender() {
  const handleSendEmail = async () => {
    try {
      // 发送单封邮件
      const result = await mailAPI.sendSingleMail({
        to: 'user@example.com',
        subject: '邮件主题',
        html: '<h1>邮件内容</h1>',
        text: '邮件文本内容'
      });

      if (result.success) {
        console.log('邮件发送成功:', result.data);
      }
    } catch (error) {
      console.error('邮件发送失败:', error);
    }
  };

  return (
    <button onClick={handleSendEmail}>
      发送邮件
    </button>
  );
}
```

### 2. 发送系统通知邮件

```typescript
import { mailAPI } from '@/services';

// 发送欢迎邮件
const sendWelcome = async (userEmail: string, userName: string) => {
  const result = await mailAPI.sendWelcomeMail(userEmail, userName);
  return result;
};

// 发送密码重置邮件
const sendPasswordReset = async (userEmail: string, resetLink: string) => {
  const result = await mailAPI.sendPasswordResetMail(userEmail, resetLink);
  return result;
};

// 发送自定义系统通知
const sendCustomNotification = async () => {
  const result = await mailAPI.sendNotificationMail({
    to: 'user@example.com',
    type: 'system_alert',
    data: {
      message: '系统维护通知',
      maintenanceTime: '2024-01-01 02:00-04:00'
    }
  });
  return result;
};
```

### 3. 批量发送邮件

```typescript
import { mailAPI } from '@/services';

const sendBatchEmails = async () => {
  const result = await mailAPI.sendBatchMail({
    template: {
      id: 'newsletter',
      name: '月度简报',
      subject: '{{appName}} - {{month}}月简报',
      htmlContent: `
        <h1>{{month}}月简报</h1>
        <p>亲爱的{{userName}}，</p>
        <p>这是本月的业务简报...</p>
      `,
    },
    recipients: [
      {
        to: 'user1@example.com',
        variables: { userName: '张三', month: '12' }
      },
      {
        to: 'user2@example.com',
        variables: { userName: '李四', month: '12' }
      },
    ],
  });

  return result;
};
```

### 4. 验证邮件服务状态

```typescript
import { mailAPI } from '@/services';

const checkEmailService = async () => {
  try {
    const result = await mailAPI.verifyMailConnection();

    if (result.success && result.data?.connected) {
      console.log('邮件服务正常');
    } else {
      console.log('邮件服务连接失败');
    }
  } catch (error) {
    console.error('邮件服务检查失败:', error);
  }
};
```

### 5. 发送测试邮件

```typescript
import { mailAPI } from '@/services';

const sendTestEmail = async () => {
  const result = await mailAPI.sendTestMail({
    to: 'test@example.com',
    subject: '测试邮件',
    content: '这是一封测试邮件',
    type: 'test'
  });

  return result;
};
```

### 6. 发送业务邮件

```typescript
import { mailAPI } from '@/services';

// 发送登录引导邮件
const sendLoginGuide = async () => {
  const result = await mailAPI.sendLoginGuideMail(
    'EMP001',
    'employee@company.com',
    '张三'
  );
  return result;
};

// 发送员工密码重置邮件
const sendEmployeePasswordReset = async () => {
  const result = await mailAPI.sendEmployeePasswordResetMail(
    'EMP001',
    'employee@company.com'
  );
  return result;
};
```

## API 接口

### 服务端 API 路由

- `POST /api/mail/send-single` - 发送单封邮件
- `POST /api/mail/send-batch` - 批量发送邮件
- `POST /api/mail/send-notification` - 发送系统通知邮件
- `POST /api/mail/test-send` - 发送测试邮件
- `GET /api/mail/verify` - 验证邮件服务连接

### 业务邮件接口

- `POST /api/mail/send-login-guide` - 发送登录引导邮件
- `POST /api/mail/send-password-reset` - 发送员工密码重置邮件

## 文件结构

```
src/
├── libs/
│   └── aliyunMailServer.ts      # 阿里云邮件服务核心封装（仅服务端）
├── services/
│   └── mail/
│       └── index.ts               # HTTP 客户端调用（可在客户端使用）
├── types/
│   └── mail.ts                    # 邮件相关类型定义
└── app/
    └── api/
        └── mail/
            ├── send-single/       # 单发邮件 API
            ├── send-batch/        # 批量发送 API
            ├── send-notification/ # 系统通知 API
            ├── test-send/         # 测试邮件 API
            ├── verify/            # 连接验证 API
            ├── send-login-guide/  # 登录引导邮件 API
            └── send-password-reset/ # 密码重置邮件 API
```

## 内置邮件模板

### 1. 欢迎邮件 (welcome)
- 用于新用户注册
- 支持变量：`{{userName}}`, `{{appName}}`

### 2. 密码重置 (password_reset)
- 用于密码重置功能
- 支持变量：`{{resetLink}}`, `{{appName}}`

### 3. 账户验证 (account_verification)
- 用于邮箱验证
- 支持变量：`{{verificationLink}}`, `{{verificationCode}}`

### 4. 系统警报 (system_alert)
- 用于系统通知
- 支持变量：`{{message}}`, `{{timestamp}}`

## 响应格式

所有 API 调用都返回统一的响应格式：

```typescript
interface MailApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

成功响应示例：
```json
{
  "success": true,
  "data": {
    "messageId": "xxx",
    "response": "250 Ok"
  }
}
```

错误响应示例：
```json
{
  "success": false,
  "error": "收件人地址不能为空"
}
```

## 注意事项

1. **环境配置**：确保在阿里云邮件推送控制台中验证发信域名
2. **安全性**：环境变量请勿提交到代码仓库
3. **客户端使用**：services/mail 可以在客户端安全使用，不会引入 Node.js 模块
4. **服务端逻辑**：所有邮件业务逻辑都在 API 路由中，便于维护和扩展
5. **错误处理**：建议在前端添加适当的错误处理和用户提示

## 故障排除

### 常见错误

1. **连接失败**
   - 检查环境变量配置
   - 验证阿里云 SMTP 设置
   - 确认网络连接

2. **认证失败**
   - 检查 SMTP 用户名和密码
   - 确认发信地址已在阿里云控制台配置

3. **API 调用失败**
   - 检查 API 路由是否正确
   - 验证请求参数格式
   - 查看浏览器网络请求详情

### 调试建议

1. 使用测试邮件接口验证配置
2. 检查浏览器开发者工具的网络面板
3. 查看服务器日志获取详细错误信息

## 更新日志

- v2.0.0: 重构架构，分离客户端和服务端逻辑
- v1.0.0: 初始版本，支持基本邮件发送功能
