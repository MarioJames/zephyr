import { ActionIcon } from '@lobehub/ui';
import { LucideSettings } from 'lucide-react';
import { memo, useState } from 'react';

const Settings = memo<{ id: string }>(({ id }) => {
  const item = {};
  const [open, setOpen] = useState(false);
  const hasSettings = false;

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
      </>
    )
  );
});

export default Settings;
