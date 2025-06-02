import { Form, type FormItemProps, Tag } from '@lobehub/ui';
import isEqual from 'fast-deep-equal';
import { debounce } from 'lodash-es';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import InfoTooltip from '@/components/InfoTooltip';
import {
  FrequencyPenalty,
  PresencePenalty,
  Temperature,
  TopP,
} from '@/features/ModelParamsControl';
import { useAgentStore } from '@/store/agent';
import { agentSelectors } from '@/store/agent/selectors';

interface ControlsProps {
  setUpdating: (updating: boolean) => void;
  updating: boolean;
}
const Controls = memo<ControlsProps>(({ setUpdating }) => {
  const updateAgentConfig = useAgentStore((s) => s.updateAgentConfig);

  const config = useAgentStore(agentSelectors.currentAgentConfig, isEqual);

  const items: FormItemProps[] = [
    {
      children: <Temperature />,
      label: (
        <Flexbox align={'center'} gap={8} horizontal justify={'space-between'}>
          温度
          <InfoTooltip title={'控制生成内容的随机性，值越高结果越随机，越低则越确定。'} />
        </Flexbox>
      ),
      name: ['params', 'temperature'],
      tag: 'temperature',
    },
    {
      children: <TopP />,
      label: (
        <Flexbox gap={8} horizontal>
          TopP
          <InfoTooltip title={'控制生成内容的多样性，值越高结果越多样。'} />
        </Flexbox>
      ),
      name: ['params', 'top_p'],
      tag: 'top_p',
    },
    {
      children: <PresencePenalty />,
      label: (
        <Flexbox gap={8} horizontal>
          存在惩罚
          <InfoTooltip title={'惩罚模型生成重复内容的倾向。'} />
        </Flexbox>
      ),
      name: ['params', 'presence_penalty'],
      tag: 'presence_penalty',
    },
    {
      children: <FrequencyPenalty />,
      label: (
        <Flexbox gap={8} horizontal>
          频率惩罚
          <InfoTooltip title={'惩罚模型频繁生成相同内容的倾向。'} />
        </Flexbox>
      ),
      name: ['params', 'frequency_penalty'],
      tag: 'frequency_penalty',
    },
  ];

  return (
    <Form
      initialValues={config}
      itemMinWidth={200}
      items={
          items.map(({ tag, ...item }) => ({ ...item, desc: <Tag size={'small'}>{tag}</Tag> }))
      }
      itemsType={'flat'}
      onValuesChange={debounce(async (values) => {
        setUpdating(true);
        await updateAgentConfig(values);
        setUpdating(false);
      }, 500)}
      styles={{
        group: {
          background: 'transparent',
          paddingBottom: 12,
        },
      }}
    />
  );
});

export default Controls;
