import { Modal, Segmented, SegmentedProps } from '@lobehub/ui';
import { memo } from 'react';
import useMergeState from 'use-merge-value';

import PluginSettingsConfig from '@/features/PluginSettings';
import { pluginHelpers } from '@/store/tool';

import APIs from './APIs';
import Meta from './Meta';

interface PluginDetailModalProps {
  id: string;
  onClose: () => void;
  onTabChange?: (key: string) => void;
  open?: boolean;
  schema: any;
  tab?: string;
}

enum Tab {
  Info = 'info',
  Settings = 'settings',
}

const PluginDetailModal = memo<PluginDetailModalProps>(
  ({ schema, onClose, id, onTabChange, open, tab }) => {
    const [tabKey, setTabKey] = useMergeState(Tab.Info, {
      onChange: onTabChange,
      value: tab,
    });

    const hasSettings = pluginHelpers.isSettingSchemaNonEmpty(schema);

    return (
      <Modal
        allowFullscreen
        footer={null}
        onCancel={onClose}
        onOk={() => {
          onClose();
        }}
        open={open}
        title={'插件详情'}
        width={650}
      >
        <Meta id={id} />
        <Segmented
          block
          onChange={(v) => setTabKey(v as Tab)}
          options={
            [
              {
                label: '接口信息',
                value: Tab.Info,
              },
              hasSettings && {
                label: '插件设置',
                value: Tab.Settings,
              },
            ].filter(Boolean) as SegmentedProps['options']
          }
          style={{
            marginBlock: 16,
          }}
          value={tabKey}
        />
        {tabKey === 'settings' ? (
          hasSettings && <PluginSettingsConfig id={id} schema={schema} />
        ) : (
          <APIs id={id} />
        )}
      </Modal>
    );
  },
);

export default PluginDetailModal;
