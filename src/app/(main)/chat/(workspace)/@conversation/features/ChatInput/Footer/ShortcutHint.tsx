import { Hotkey, combineKeys } from '@lobehub/ui';
import { useTheme } from 'antd-style';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { KeyEnum } from '@/types/hotkey';

const ShortcutHint = memo(() => {
  const theme = useTheme();
  // 默认使用 Enter 发送，Cmd+Enter 换行

  const sendShortcut = KeyEnum.Enter;

  const wrapperShortcut = combineKeys([KeyEnum.Mod, KeyEnum.Enter]);

  return (
    <Flexbox
      align={'center'}
      gap={4}
      horizontal
      style={{
        color: theme.colorTextDescription,
        fontSize: 12,
        marginRight: 12,
      }}
    >
      <Hotkey
        keys={sendShortcut}
        style={{ color: 'inherit' }}
        variant={'borderless'}
      />
      <span>{'发送'}</span>
      <span>/</span>
      <Hotkey
        keys={wrapperShortcut}
        style={{ color: 'inherit' }}
        variant={'borderless'}
      />
      <span>{'换行'}</span>
    </Flexbox>
  );
});

export default ShortcutHint;
