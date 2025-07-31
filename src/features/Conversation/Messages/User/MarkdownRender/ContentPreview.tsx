import { Button, Markdown, MaskShadow } from '@lobehub/ui';
import { Flexbox } from 'react-layout-kit';

interface ContentPreviewProps {
  content: string;
  displayMode: 'chat' | 'docs';
  id: string;
}

const ContentPreview = ({ content, id }: ContentPreviewProps) => {
  return (
    <Flexbox>
      <MaskShadow>
        <Markdown variant={'chat'}>{content.slice(0, 1000)}</Markdown>
      </MaskShadow>
      <Flexbox padding={4}>
        <Button block color={'default'} size={'small'} variant={'filled'}>
          {'查看详情'}
        </Button>
      </Flexbox>
    </Flexbox>
  );
};
export default ContentPreview;
