export enum FilesTabs {
    All = 'all',
    Audios = 'audios',
    Documents = 'documents',
    Images = 'images',
    Videos = 'videos',
    Websites = 'websites',
  }

export interface FileListItem {
    createdAt: Date;
    id: string;
    name: string;
    size: number;
    updatedAt: Date;
    url: string;
    fileType: string;
  }