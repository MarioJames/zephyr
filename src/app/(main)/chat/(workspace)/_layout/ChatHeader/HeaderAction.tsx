'use client';

import { ActionIcon, Tooltip } from '@lobehub/ui';
import { PanelRightClose, PanelRightOpen } from 'lucide-react';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { DESKTOP_HEADER_ICON_SIZE } from '@/const/layoutTokens';
import { useGlobalStore } from '@/store/global';
import { systemStatusSelectors } from '@/store/global/selectors';
import { useUserStore } from '@/store/user';
import { settingsSelectors } from '@/store/user/selectors';
import { HotkeyEnum } from '@/types/hotkey';

const HeaderAction = memo<{ className?: string }>(({ className }) => {
  const hotkey = useUserStore(settingsSelectors.getHotkeyById(HotkeyEnum.ToggleRightPanel));
  const [showAgentSettings, toggleConfig] = useGlobalStore((s) => [
    systemStatusSelectors.showChatSideBar(s),
    s.toggleChatSideBar,
  ]);

  return (
    <Flexbox className={className} gap={4} horizontal>
      <Tooltip hotkey={hotkey} title={'显示/隐藏话题面板'}>
        <ActionIcon
          icon={showAgentSettings ? PanelRightClose : PanelRightOpen}
          onClick={() => toggleConfig()}
          size={DESKTOP_HEADER_ICON_SIZE}
        />
      </Tooltip>
    </Flexbox>
  );
});

export default HeaderAction;
