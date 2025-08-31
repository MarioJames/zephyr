import { memo, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import { FileItem as FileItemType } from '@/services/files';

import FileItem from './Item';
import Structured from './Structured';

interface FileListViewerProps {
  items: FileItemType[];
}

const FileListViewer = memo<FileListViewerProps>(({ items }) => {
  const [openStructured, setOpenStructured] = useState(false);
  const [fileId, setFileId] = useState<string | undefined>(undefined);

  return (
    <>
      <Flexbox gap={8}>
        {items.map((item) => (
          <FileItem
            key={item.id}
            {...item}
            onClick={() => {
              setFileId(item.id);
              setOpenStructured(true);
            }}
          />
        ))}
      </Flexbox>
      <Structured
        fileId={fileId}
        open={openStructured}
        onClose={() => setOpenStructured(false)}
      />
    </>
  );
});
export default FileListViewer;
