import { Icon } from '@lobehub/ui';
import { Divider, Popover } from 'antd';
import { useTheme } from 'antd-style';
import { BadgeCent, CoinsIcon } from 'lucide-react';
import { memo } from 'react';
import { Center, Flexbox } from 'react-layout-kit';

import InfoTooltip from '@/components/InfoTooltip';
import { aiModelSelectors, useAiInfraStore } from '@/store/aiInfra';
import { useGlobalStore } from '@/store/global';
import { systemStatusSelectors } from '@/store/global/selectors';
import { MessageMetadata } from '@/types/message';
import { formatNumber } from '@/utils/format';

import ModelCard from './ModelCard';
import TokenProgress, { TokenProgressItem } from './TokenProgress';
import { getDetailsToken } from './tokens';

interface TokenDetailProps {
  meta: MessageMetadata;
  model: string;
  provider: string;
}

const TokenDetail = memo<TokenDetailProps>(({ meta, model, provider }) => {
  const theme = useTheme();

  const modelCard = useAiInfraStore(aiModelSelectors.getModelCard(model, provider));
  const isShowCredit = useGlobalStore(systemStatusSelectors.isShowCredit) && !!modelCard?.pricing;

  const detailTokens = getDetailsToken(meta, modelCard);
  const inputDetails = [
    !!detailTokens.inputAudio && {
      color: theme.cyan9,
      id: 'reasoning',
      title: '音频输入',
      value: isShowCredit ? detailTokens.inputAudio.credit : detailTokens.inputAudio.token,
    },
    !!detailTokens.inputCitation && {
      color: theme.orange,
      id: 'inputText',
      title: '引用输入',
      value: isShowCredit ? detailTokens.inputCitation.credit : detailTokens.inputCitation.token,
    },
    !!detailTokens.inputText && {
      color: theme.green,
      id: 'inputText',
      title: '文本输入',
      value: isShowCredit ? detailTokens.inputText.credit : detailTokens.inputText.token,
    },
  ].filter(Boolean) as TokenProgressItem[];

  const outputDetails = [
    !!detailTokens.outputReasoning && {
      color: theme.pink,
      id: 'reasoning',
      title: '深度思考',
      value: isShowCredit
        ? detailTokens.outputReasoning.credit
        : detailTokens.outputReasoning.token,
    },
    !!detailTokens.outputAudio && {
      color: theme.cyan9,
      id: 'outputAudio',
      title: '音频输出',
      value: isShowCredit ? detailTokens.outputAudio.credit : detailTokens.outputAudio.token,
    },
    !!detailTokens.outputText && {
      color: theme.green,
      id: 'outputText',
      title: '文本输出',
      value: isShowCredit ? detailTokens.outputText.credit : detailTokens.outputText.token,
    },
  ].filter(Boolean) as TokenProgressItem[];

  const totalDetail = [
    !!detailTokens.inputCacheMiss && {
      color: theme.colorFill,

      id: 'uncachedInput',
      title: '输入未缓存',
      value: isShowCredit ? detailTokens.inputCacheMiss.credit : detailTokens.inputCacheMiss.token,
    },
    !!detailTokens.inputCached && {
      color: theme.orange,
      id: 'inputCached',
      title: '输入缓存',
      value: isShowCredit ? detailTokens.inputCached.credit : detailTokens.inputCached.token,
    },
    !!detailTokens.inputCachedWrite && {
      color: theme.yellow,
      id: 'cachedWriteInput',
      title: '输入缓存写入',
      value: isShowCredit
        ? detailTokens.inputCachedWrite.credit
        : detailTokens.inputCachedWrite.token,
    },
    !!detailTokens.totalOutput && {
      color: theme.colorSuccess,
      id: 'output',
      title: '输出',
      value: isShowCredit ? detailTokens.totalOutput.credit : detailTokens.totalOutput.token,
    },
  ].filter(Boolean) as TokenProgressItem[];

  const displayTotal =
    isShowCredit && !!detailTokens.totalTokens
      ? formatNumber(detailTokens.totalTokens.credit)
      : formatNumber(detailTokens.totalTokens!.token);

  const averagePricing = formatNumber(
    detailTokens.totalTokens!.credit / detailTokens.totalTokens!.token,
    2,
  );

  const tps = meta?.tps ? formatNumber(meta.tps, 2) : undefined;
  const ttft = meta?.ttft ? formatNumber(meta.ttft / 1000, 2) : undefined;

  return (
    <Popover
      arrow={false}
      content={
        <Flexbox gap={8} style={{ minWidth: 200 }}>
          {modelCard && <ModelCard {...modelCard} provider={provider} />}

          <Flexbox gap={20}>
            {inputDetails.length > 1 && (
              <Flexbox gap={4}>
                <Flexbox
                  align={'center'}
                  gap={4}
                  horizontal
                  justify={'space-between'}
                  width={'100%'}
                >
                  <div style={{ color: theme.colorTextDescription, fontSize: 12 }}>
                    输入明细
                  </div>
                </Flexbox>
                <TokenProgress data={inputDetails} showIcon />
              </Flexbox>
            )}
            {outputDetails.length > 1 && (
              <Flexbox gap={4}>
                <Flexbox
                  align={'center'}
                  gap={4}
                  horizontal
                  justify={'space-between'}
                  width={'100%'}
                >
                  <div style={{ color: theme.colorTextDescription, fontSize: 12 }}>
                    输出明细
                  </div>
                </Flexbox>
                <TokenProgress data={outputDetails} showIcon />
              </Flexbox>
            )}
            <Flexbox>
              <TokenProgress data={totalDetail} showIcon />
              <Divider style={{ marginBlock: 8 }} />
              <Flexbox align={'center'} gap={4} horizontal justify={'space-between'}>
                <div style={{ color: theme.colorTextSecondary }}>
                  总计消耗
                </div>
                <div style={{ fontWeight: 500 }}>{displayTotal}</div>
              </Flexbox>
              {isShowCredit && (
                <Flexbox align={'center'} gap={4} horizontal justify={'space-between'}>
                  <div style={{ color: theme.colorTextSecondary }}>
                    平均单价
                  </div>
                  <div style={{ fontWeight: 500 }}>{averagePricing}</div>
                </Flexbox>
              )}
              {tps && (
                <Flexbox align={'center'} gap={4} horizontal justify={'space-between'}>
                  <Flexbox gap={8} horizontal>
                    <div style={{ color: theme.colorTextSecondary }}>
                      TPS
                    </div>
                    <InfoTooltip title={'Tokens Per Second，TPS。指AI生成内容的平均速度（Token/秒），在接收到首个 Token 后开始计算。'} />
                  </Flexbox>
                  <div style={{ fontWeight: 500 }}>{tps}</div>
                </Flexbox>
              )}
              {ttft && (
                <Flexbox align={'center'} gap={4} horizontal justify={'space-between'}>
                  <Flexbox gap={8} horizontal>
                    <div style={{ color: theme.colorTextSecondary }}>
                      TTFT
                    </div>
                    <InfoTooltip title={'Time To First Token，TTFT。指从您发送消息到客户端接收到首个 Token 的时间间隔。'} />
                  </Flexbox>
                  <div style={{ fontWeight: 500 }}>{ttft}s</div>
                </Flexbox>
              )}
            </Flexbox>
          </Flexbox>
        </Flexbox>
      }
      placement={'top'}
      trigger={['hover', 'click']}
    >
      <Center gap={2} horizontal style={{ cursor: 'default' }}>
        <Icon icon={isShowCredit ? BadgeCent : CoinsIcon} />
        {displayTotal}
      </Center>
    </Popover>
  );
});

export default TokenDetail;
