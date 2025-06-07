import { Tag, Tooltip } from '@lobehub/ui';
import { useTheme } from 'antd-style';
import { CSSProperties, memo, useMemo } from 'react';

export enum PlanType {
  Preview = 'preview',
}

export interface PlanTagProps {
  type?: PlanType;
}

const PlanTag = memo<PlanTagProps>(({ type = PlanType.Preview }) => {
  const theme = useTheme();
  const tag: {
    desc: string;
    style: CSSProperties;
    title: string;
  } = useMemo(() => {
    switch (type) {
      case PlanType.Preview: {
        return {
          desc: '社区用户',
          style: {
            background: theme.colorFill,
          },
          title: 'Community',
        };
      }
    }
  }, []);

  return (
    <Tooltip title={tag.desc}>
      <Tag bordered={false} style={{ ...tag.style, borderRadius: 12, cursor: 'pointer' }}>
        {tag.title}
      </Tag>
    </Tooltip>
  );
});

export default PlanTag;
