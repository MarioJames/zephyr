import { FileItem } from '@/services/files';
import { ParsedFileContent } from '@/store/file/slices/core/initialState';

export interface FileForAI {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string; // 图片url
  content?: string; // 文档内容
  base64?: string; // 图片base64
  metadata?: Record<string, unknown>;
}

/**
 * 处理图片文件，生成base64编码
 */
export async function processImageFile(file: File): Promise<{ base64: string }> {
  const arrayBuffer = await file.arrayBuffer();
  const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

  return {
    base64: `data:${file.type};base64,${base64}`
  };
}

/**
 * 格式化文档文件为AI可理解的格式
 */
export function formatDocumentForAI(files: FileForAI[]): string {
  if (!files.length) return '';

  const filePrompts = files.map(file => {
    const metadata = file.metadata ? JSON.stringify(file.metadata, null, 2) : '';

    return `<file id="${file.id}" name="${file.name}" type="${file.type}" size="${file.size}">
${metadata ? `<metadata>\n${metadata}\n</metadata>\n` : ''}
${file.content}
</file>`;
  }).join('\n\n');

  return `<files>
<files_docstring>以下是用户上传的文件内容，你可以参考这些信息：</files_docstring>
${filePrompts}
</files>`;
}

/**
 * 格式化图片文件为AI可理解的格式
 */
export function formatImagesForAI(images: FileForAI[]): string {
  if (!images.length) return '';

  const imagePrompts = images.map(img => {
    return `<image name="${img.name}" type="${img.type}" size="${img.size}" url="${img.url}"></image>`;
  }).join('\n');

  return `<images>
<images_docstring>以下是用户上传的图片，你可以参考这些图片内容：</images_docstring>
${imagePrompts}
</images>`;
}

/**
 * 创建包含文件上下文的消息
 */
export function createMessageWithFiles(userMessage: string, files: FileForAI[]): {
  role: 'user';
  content: string | Array<{ type: 'text' | 'image_url'; text?: string; image_url?: { url: string; detail: string } }>;
} {
  const documents = files.filter(f => !f.type.startsWith('image/'));
  const images = files.filter(f => f.type.startsWith('image/'));

  const systemContext = `<!-- 系统上下文 (不是用户查询的一部分) -->
<context.instruction>
以下部分包含系统注入的上下文信息，请遵循以下指导：

1. 始终优先处理用户可见的内容
2. 只有在用户的查询依赖上下文时，才需要上下文信息
3. 基于提供的文件内容回答问题时，请引用具体的文件名和相关内容
</context.instruction>

<files_info>
${formatImagesForAI(images)}
${formatDocumentForAI(documents)}
</files_info>
<!-- 系统上下文结束 -->

`;

  // 对于支持多模态的模型
  if (images.length > 0) {
    return {
      role: 'user',
      content: [
        { type: 'text', text: userMessage + '\n\n' + systemContext },
        ...images.map(img => ({
          type: 'image_url' as const,
          image_url: { url: img.base64!, detail: 'auto' as const }
        }))
      ]
    };
  }

  // 纯文本模式
  return {
    role: 'user',
    content: userMessage + '\n\n' + systemContext
  };
}

/**
 * 将FileItem和ParsedFileContent合并为FileForAI
 */
export function mergeFileData(
  fileItem: FileItem,
  parsedContent?: ParsedFileContent
): FileForAI {
  return {
    id: fileItem.id,
    name: fileItem.filename,
    type: fileItem.fileType,
    size: fileItem.size,
    content: parsedContent?.content,
    metadata: parsedContent?.metadata,
  };
}

/**
 * 将ParsedFileContent转换为FileForAI
 */
export function parsedContentToFileForAI(parsedContent: ParsedFileContent): FileForAI {
  return {
    id: parsedContent.fileId,
    name: parsedContent.filename,
    type: parsedContent.fileType,
    size: 0, // 解析后的内容没有原始文件大小信息
    content: parsedContent.content,
    metadata: parsedContent.metadata,
  };
}

/**
 * 处理文件并生成AI格式的数据
 */
export async function processFilesForAI(
  files: File[],
  parseDocument: (file: File) => Promise<ParsedFileContent>
): Promise<FileForAI[]> {
  const processedFiles: FileForAI[] = [];

  for (const file of files) {
    const fileForAI: FileForAI = {
      id: file.name,
      name: file.name,
      type: file.type,
      size: file.size,
    };

    try {
      if (file.type.startsWith('image/')) {
        // 处理图片
        const { base64 } = await processImageFile(file);
        fileForAI.base64 = base64;
      } else {
        // 处理文档
        const parsedContent = await parseDocument(file);
        fileForAI.content = parsedContent.content;
        fileForAI.metadata = parsedContent.metadata;
      }
    } catch (error) {
      console.error(`处理文件 ${file.name} 失败:`, error);
      // 即使处理失败，也保留基本文件信息
    }

    processedFiles.push(fileForAI);
  }

  return processedFiles;
}

/**
 * 支持的文档文件类型
 */
export const SUPPORTED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'text/markdown',
  'text/csv',
];

/**
 * 支持的图片文件类型
 */
export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/bmp',
  'image/svg+xml',
];

/**
 * 检查文件类型是否支持
 */
export function isSupportedFileType(file: File): boolean {
  return SUPPORTED_DOCUMENT_TYPES.includes(file.type) || SUPPORTED_IMAGE_TYPES.includes(file.type);
}

/**
 * 检查是否为文档文件
 */
export function isDocumentFile(file: File): boolean {
  return SUPPORTED_DOCUMENT_TYPES.includes(file.type);
}

/**
 * 检查是否为图片文件
 */
export function isImageFile(file: File): boolean {
  return SUPPORTED_IMAGE_TYPES.includes(file.type);
}
