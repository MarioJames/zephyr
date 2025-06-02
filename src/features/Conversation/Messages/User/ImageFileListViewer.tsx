import { PreviewGroup } from '@lobehub/ui';
import { memo } from 'react';

import GalleyGrid from '@/components/GalleyGrid';
import FileItem from '@/components/FileItem';

interface ImageFileItem {
  alt?: string;
  id: string;
  loading?: boolean;
  onRemove?: (id: string) => void;
  url: string;
}

interface FileListProps {
  items: ImageFileItem[];
}

const ImageFileListViewer = memo<FileListProps>(({ items }) => {
  return (
    <PreviewGroup>
      <GalleyGrid items={items} renderItem={FileItem} />
    </PreviewGroup>
  );
});

export default ImageFileListViewer;
