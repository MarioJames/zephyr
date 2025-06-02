import { ActionIcon } from '@lobehub/ui';
import { LucideSettings } from 'lucide-react';
import { memo, useState } from 'react';

import PluginDetailModal from '@/features/PluginDetailModal';
import { pluginHelpers, useToolStore } from '@/store/tool';
import { pluginSelectors } from '@/store/tool/selectors';

const Settings = memo<{ id: string }>(({ id }) => {
  const item = useToolStore(pluginSelectors.getToolManifestById(id));
  const [open, setOpen] = useState(false);
  const hasSettings = pluginHelpers.isSettingSchemaNonEmpty(item?.settings);

  return (
    hasSettings && (
      <>
        <ActionIcon
          icon={LucideSettings}
          onClick={() => {
            setOpen(true);
          }}
          size={'small'}
          title={'设置'}
        />
        <PluginDetailModal
          id={id}
          onClose={() => {
            setOpen(false);
          }}
          open={open}
          schema={item?.settings}
        />
      </>
    )
  );
});

export default Settings;
