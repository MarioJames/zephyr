import { SliderWithInput } from '@lobehub/ui';
import { Flex, Typography } from 'antd';
import { debounce } from 'lodash-es';
import { memo, useCallback, useEffect, useState } from 'react';

import { customerSelectors, useCustomerStore } from '@/store/customer';

interface ControlsProps {
  updating: boolean;
}
const Controls = memo<ControlsProps>(({ updating }) => {
  const [historyCount, updateCustomerExtend] = useCustomerStore((s) => [
    customerSelectors.currentCustomerChatConfigHistoryCount(s),
    s.updateCustomerExtend,
  ]);

  const [tempHistoryCount, setTempHistoryCount] = useState(historyCount);

  useEffect(() => {
    setTempHistoryCount(historyCount);
  }, [historyCount]);

  const handleHistoryCountChange = useCallback(
    debounce((value: number) => {
      updateCustomerExtend({
        chatConfig: {
          historyCount: value,
        },
      });
    }, 1000),
    []
  );

  return (
    <Flex vertical>
      <Typography.Text>历史消息数量</Typography.Text>
      <SliderWithInput
        disabled={updating}
        max={20}
        min={0}
        size={'small'}
        step={1}
        style={{ marginBlock: 8, paddingLeft: 4 }}
        value={tempHistoryCount}
        onChange={(value) => {
          setTempHistoryCount(value);

          handleHistoryCountChange(value);
        }}
      />
    </Flex>
  );
});

export default Controls;
