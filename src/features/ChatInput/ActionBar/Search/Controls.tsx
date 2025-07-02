import { Icon } from '@lobehub/ui';
import { GlobeOffIcon } from '@lobehub/ui/icons';
import { createStyles } from 'antd-style';
import { LucideIcon, SparkleIcon } from 'lucide-react';
import { memo } from 'react';
import { Center, Flexbox } from 'react-layout-kit';

import { customerSelectors, useCustomerStore } from '@/store/customer';

const useStyles = createStyles(({ css, token }) => ({
  active: css`
    background: ${token.colorFillTertiary};
  `,
  check: css`
    margin-inline-start: 12px;
    font-size: 16px;
    color: ${token.colorPrimary};
  `,
  description: css`
    font-size: 12px;
    color: ${token.colorTextDescription};
  `,
  icon: css`
    border: 1px solid ${token.colorFillTertiary};
    border-radius: ${token.borderRadius}px;
    background: ${token.colorBgElevated};
  `,
  option: css`
    cursor: pointer;

    width: 100%;
    padding-block: 8px;
    padding-inline: 8px;
    border-radius: ${token.borderRadius}px;

    transition: background-color 0.2s;

    &:hover {
      background: ${token.colorFillTertiary};
    }
  `,
  title: css`
    font-size: 14px;
    font-weight: 500;
    color: ${token.colorText};
  `,
}));

interface NetworkOption {
  description: string;
  disable?: boolean;
  icon: LucideIcon;
  label: string;
  value: string;
}

const Item = memo<NetworkOption>(({ value, description, icon, label }) => {
  const { cx, styles } = useStyles();
  const [mode, updateCustomerExtend] = useCustomerStore((s) => [
    customerSelectors.currentCustomerChatConfigSearchMode(s),
    s.updateCustomerExtend,
  ]);

  return (
    <Flexbox
      align={'flex-start'}
      className={cx(styles.option, mode === value && styles.active)}
      gap={12}
      horizontal
      key={value}
      onClick={async () => {
        await updateCustomerExtend({
          chatConfig: {
            searchMode: value,
            useModelBuiltinSearch: value === 'auto',
          },
        });
      }}
    >
      <Center className={styles.icon} flex={'none'} height={32} width={32}>
        <Icon icon={icon} />
      </Center>
      <Flexbox flex={1}>
        <div className={styles.title}>{label}</div>
        <div className={styles.description}>{description}</div>
      </Flexbox>
    </Flexbox>
  );
});

const Controls = memo(() => {
  const options: NetworkOption[] = [
    {
      description: '仅使用模型的基础知识，不进行网络搜索',
      icon: GlobeOffIcon,
      label: '关闭联网',
      value: 'off',
    },
    {
      description: '使用模型内置搜索引擎',
      icon: SparkleIcon,
      label: '开启联网',
      value: 'auto',
    },
  ];

  return (
    <Flexbox gap={4}>
      {options.map((option) => (
        <Item {...option} key={option.value} />
      ))}
    </Flexbox>
  );
});

export default Controls;
