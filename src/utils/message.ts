import { MessageItem } from '@/services/messages';
import { FileForAI } from './file';
import { ChatMessage } from '@/types/message';

/**
 * 格式化文档文件为 AI 可理解的格式
 */
export function formatDocumentForAI(files: FileForAI[]): string {
  if (!files.length) return '';

  const filePrompts = files
    .map((file) => {
      const metadata = file.metadata
        ? JSON.stringify(file.metadata, null, 2)
        : '';

      return `<file id="${file.id}" name="${file.filename}" type="${
        file.fileType
      }" size="${file.size}">
${metadata ? `<metadata>\n${metadata}\n</metadata>\n` : ''}
${file.content}
</file>`;
    })
    .join('\n\n');

  return `<files>
<files_docstring>以下是用户上传的文件内容，你可以参考这些信息：</files_docstring>
${filePrompts}
</files>`;
}

/**
 * 创建包含文件上下文的消息
 */
export function generateMessageWithFiles(
  userMessage: string,
  files: FileForAI[]
): string {
  const documents = files.filter((f) => !f.fileType?.startsWith('image/'));

  const systemContext = `<!-- 系统上下文 (不是用户查询的一部分) -->
<context.instruction>
以下部分包含系统注入的上下文信息，请遵循以下指导：

1. 始终优先处理用户可见的内容
2. 只有在用户的查询依赖上下文时，才需要上下文信息
3. 基于提供的文件内容回答问题时，请引用具体的文件名和相关内容
</context.instruction>

<files_info>
${formatDocumentForAI(documents)}
</files_info>
<!-- 系统上下文结束 -->

`;

  // 纯文本模式
  return documents.length > 0
    ? userMessage + '\n\n' + systemContext
    : userMessage;
}

/**
 * 把原始的消息转化成openai的格式
 */
export function transformMessageToOpenAIFormat(
  message: MessageItem
): ChatMessage {
  const images =
    message.files?.filter(
      (file) => file.fileType?.startsWith('image/') && file.url
    ) || [];

  return {
    role: message.role,
    content: [
      {
        type: 'text',
        text: message.content,
      },
      ...images.map((img) => ({
        type: 'image_url',
        image_url: { url: img.url, detail: 'auto' },
      })),
    ],
  } as ChatMessage;
}

/**
 * 从消息内容中移除系统上下文，只保留用户的原始消息
 */
export function removeSystemContext(content: string): string {
  if (!content) return content;

  // 匹配并移除系统上下文部分
  const systemContextRegex = /<!-- 系统上下文[\S\s]*?<!-- 系统上下文结束 -->/g;

  const cleanContent = content.replaceAll(systemContextRegex, '').trim();

  // 如果移除后内容为空，返回原内容（防止意外情况）
  if (!cleanContent) {
    return content;
  }

  return cleanContent;
}

/**
 * 检查消息是否包含系统上下文
 */
export function hasSystemContext(content: string): boolean {
  return content.includes('<!-- 系统上下文');
}
