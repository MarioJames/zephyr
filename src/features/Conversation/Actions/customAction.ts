import type { ActionIconGroupItemType } from '@lobehub/ui';
import { css, cx } from 'antd-style';
import { LanguagesIcon, Play } from 'lucide-react';
import { useMemo } from 'react';

import { localeOptions } from '@/config/translate';

const translateStyle = css`
  .ant-dropdown-menu-sub {
    overflow-y: scroll;
    max-height: 400px;
  }
`;

export const useCustomActions = () => {
  const translate = {
    children: localeOptions.map((i) => ({
      key: i.value,
      label: i.label,
    })),
    icon: LanguagesIcon,
    key: 'translate',
    label: '翻译',
    popupClassName: cx(translateStyle),
  } as ActionIconGroupItemType;

  return useMemo(() => ({ translate }), []);
};
