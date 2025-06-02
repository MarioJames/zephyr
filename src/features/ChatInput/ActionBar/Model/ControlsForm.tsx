import { Form } from '@lobehub/ui';
import type { FormItemProps } from '@lobehub/ui';
import { Form as AntdForm, Switch } from 'antd';
import isEqual from 'fast-deep-equal';
import Link from 'next/link';
import { memo } from 'react';

import { useAgentStore } from '@/store/agent';
import { agentChatConfigSelectors, agentSelectors } from '@/store/agent/selectors';
import { aiModelSelectors, useAiInfraStore } from '@/store/aiInfra';

import ContextCachingSwitch from './ContextCachingSwitch';
import ReasoningTokenSlider from './ReasoningTokenSlider';

interface ControlsProps {
  setUpdating: (updating: boolean) => void;
  updating: boolean;
}

const ControlsForm = memo<ControlsProps>(({ setUpdating }) => {
  const [model, provider, updateAgentChatConfig] = useAgentStore((s) => [
    agentSelectors.currentAgentModel(s),
    agentSelectors.currentAgentModelProvider(s),
    s.updateAgentChatConfig,
  ]);
  const [form] = Form.useForm();
  const enableReasoning = AntdForm.useWatch(['enableReasoning'], form);

  const config = useAgentStore(agentChatConfigSelectors.currentChatConfig, isEqual);

  const modelExtendParams = useAiInfraStore(aiModelSelectors.modelExtendParams(model, provider));

  const items = [
    {
      children: <ContextCachingSwitch />,
      desc: (
        <span style={{ display: 'inline-block', width: 300 }}>
          单条对话生成成本最高可降低 90%，响应速度提升 4 倍（
          <a href={'https://www.anthropic.com/news/prompt-caching?utm_source=lobechat'} rel={'nofollow'} target='_blank'>了解更多</a>
          ）。开启后将自动禁用历史消息数限制
        </span>
      ),
      label: '开启上下文缓存',
      minWidth: undefined,
      name: 'disableContextCaching',
    },
    {
      children: <Switch />,
      desc: (
        <span style={{ display: 'inline-block', width: 300 }}>
          基于 Claude Thinking 机制限制（
          <a href={'https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking?utm_source=lobechat#why-thinking-blocks-must-be-preserved'} rel={'nofollow'} target='_blank'>了解更多</a>
          ），开启后将自动禁用历史消息数限制
        </span>
      ),
      label: '开启深度思考',
      layout: 'horizontal',
      minWidth: undefined,
      name: 'enableReasoning',
    },
    enableReasoning && {
      children: <ReasoningTokenSlider />,
      label: '思考消耗 Token',
      layout: 'vertical',
      minWidth: undefined,
      name: 'reasoningBudgetToken',
      style: {
        paddingBottom: 0,
      },
    },
  ].filter(Boolean) as FormItemProps[];

  return (
    <Form
      form={form}
      initialValues={config}
      items={
        (modelExtendParams || [])
          .map((item: any) => items.find((i) => i.name === item))
          .filter(Boolean) as FormItemProps[]
      }
      itemsType={'flat'}
      onValuesChange={async (_, values) => {
        setUpdating(true);
        await updateAgentChatConfig(values);
        setUpdating(false);
      }}
      size={'small'}
      style={{ fontSize: 12 }}
      variant={'borderless'}
    />
  );
});

export default ControlsForm;
