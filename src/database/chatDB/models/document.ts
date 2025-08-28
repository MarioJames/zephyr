import { eq } from 'drizzle-orm/expressions';

import { LobeChatDatabase } from '../type';
import { documents } from '../schemas';

export interface DocumentItem {
  id: string;
  title: string | null;
  content: string | null;
  fileType: string;
  filename: string | null;
  totalCharCount: number;
  totalLineCount: number;
  metadata: Record<string, any> | null;
  pages: any[] | null;
  sourceType: 'file' | 'web' | 'api';
  source: string;
  fileId: string | null;
  userId: string;
  clientId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class DocumentModel {
  private db: LobeChatDatabase;

  constructor(db: LobeChatDatabase) {
    this.db = db;
  }

  /**
   * 根据文件ID查找文档内容
   * @param fileId 文件ID
   * @returns DocumentItem | undefined
   */
  findByFileId = async (fileId: string): Promise<DocumentItem | undefined> => {
    return this.db.query.documents.findFirst({
      where: eq(documents.fileId, fileId),
    });
  };
}
