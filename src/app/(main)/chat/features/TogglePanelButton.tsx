'use client';

import { ActionIcon, Tooltip } from '@lobehub/ui';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { memo } from 'react';

import { DESKTOP_HEADER_ICON_SIZE } from '@/const/layoutTokens';
import { useGlobalStore } from '@/store/global';
import { globalSelectors } from '@/store/global/selectors';

export const TOOGLE_PANEL_BUTTON_ID = 'toggle-panel-button';

const TogglePanelButton = memo(() => {
  const showSessionPanel = useGlobalStore(
    globalSelectors.showSessionPanel
  );
  const updateSystemStatus = useGlobalStore((s) => s.updateSystemStatus);

  return (
    <Tooltip title={'显示/隐藏助手面板'}>
      <ActionIcon
        icon={showSessionPanel ? PanelLeftClose : PanelLeftOpen}
        id={TOOGLE_PANEL_BUTTON_ID}
        onClick={() => {
          updateSystemStatus({
            showSessionPanel: !showSessionPanel,
          });
        }}
        size={DESKTOP_HEADER_ICON_SIZE}
      />
    </Tooltip>
  );
});

TogglePanelButton.displayName = 'TogglePanelButton';

export default TogglePanelButton;
