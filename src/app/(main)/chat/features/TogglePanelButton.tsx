'use client';

import { ActionIcon, Tooltip } from '@lobehub/ui';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { memo } from 'react';

import { DESKTOP_HEADER_ICON_SIZE } from '@/const/layoutTokens';
import { useGlobalStore } from '@/store/global';
import { systemStatusSelectors } from '@/store/global/selectors';
import { useUserStore } from '@/store/user';
import { settingsSelectors } from '@/store/user/selectors';
import { HotkeyEnum } from '@/types/hotkey';

export const TOOGLE_PANEL_BUTTON_ID = 'toggle-panel-button';

const TogglePanelButton = memo(() => {
  const hotkey = useUserStore(settingsSelectors.getHotkeyById(HotkeyEnum.ToggleLeftPanel));

  const showSessionPanel = useGlobalStore(systemStatusSelectors.showSessionPanel);
  const updateSystemStatus = useGlobalStore((s) => s.updateSystemStatus);

  return (
    <Tooltip hotkey={hotkey} title={'显示/隐藏助手面板'}>
      <ActionIcon
        icon={showSessionPanel ? PanelLeftClose : PanelLeftOpen}
        id={TOOGLE_PANEL_BUTTON_ID}
        onClick={() => {
          updateSystemStatus({
            sessionsWidth: showSessionPanel ? 0 : 320,
            showSessionPanel: !showSessionPanel,
          });
        }}
        size={DESKTOP_HEADER_ICON_SIZE}
      />
    </Tooltip>
  );
});

export default TogglePanelButton;
