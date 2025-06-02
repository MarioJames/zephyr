import { ModelIcon } from '@lobehub/icons';
import { Icon, Segmented, Tooltip } from '@lobehub/ui';
import { createStyles } from 'antd-style';
import { ArrowDownToDot, ArrowUpFromDot, BookUp2Icon, CircleFadingArrowUp } from 'lucide-react';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { getPrice } from '@/features/Conversation/Extras/Usage/UsageDetail/pricing';
import { useGlobalStore } from '@/store/global';
import { systemStatusSelectors } from '@/store/global/selectors';
import { LobeDefaultAiModelListItem } from '@/types/aiModel';

export const useStyles = createStyles(({ css, token }) => {
  return {
    container: css`
      font-size: 12px;
    `,
    desc: css`
      line-height: 12px;
      color: ${token.colorTextDescription};
    `,
    pricing: css`
      font-size: 12px;
      color: ${token.colorTextSecondary};
    `,
  };
});

interface ModelCardProps extends LobeDefaultAiModelListItem {
  provider: string;
}

const ModelCard = memo<ModelCardProps>(({ pricing, id, provider, displayName }) => {
  const { styles } = useStyles();

  const isShowCredit = useGlobalStore(systemStatusSelectors.isShowCredit) && !!pricing;
  const updateSystemStatus = useGlobalStore((s) => s.updateSystemStatus);

  const formatPrice = getPrice(pricing || {});

  return (
    <Flexbox gap={8}>
      <Flexbox
        align={'center'}
        className={styles.container}
        flex={1}
        gap={40}
        horizontal
        justify={'space-between'}
      >
        <Flexbox align={'center'} gap={8} horizontal>
          <ModelIcon model={id} size={22} />
          <Flexbox flex={1} gap={2} style={{ minWidth: 0 }}>
            <Flexbox align={'center'} gap={8} horizontal style={{ lineHeight: '12px' }}>
              {displayName || id}
            </Flexbox>
            <span className={styles.desc}>{provider}</span>
          </Flexbox>
        </Flexbox>
        {!!pricing && (
          <Flexbox>
            <Segmented
              onChange={(value) => {
                updateSystemStatus({ isShowCredit: value === 'credit' });
              }}
              options={[
                { label: 'Token', value: 'token' },
                {
                  label: (
                    <Tooltip title={'为便于计数，我们将 1$ 折算为 1M 积分，例如 $3/M tokens 即可折算为 3积分/token'}>
                      {'积分'}
                    </Tooltip>
                  ),
                  value: 'credit',
                },
              ]}
              size={'small'}
              value={isShowCredit ? 'credit' : 'token'}
            />
          </Flexbox>
        )}
      </Flexbox>
      {isShowCredit ? (
        <Flexbox horizontal justify={'space-between'}>
          <div />
          <Flexbox align={'center'} className={styles.pricing} gap={8} horizontal>
            {'积分定价'}:
            {pricing?.cachedInput && (
              <Tooltip
                title={`缓存输入 ${formatPrice.cachedInput}/积分 · $${formatPrice.cachedInput}/M`}
              >
                <Flexbox gap={2} horizontal>
                  <Icon icon={CircleFadingArrowUp} />
                  {formatPrice.cachedInput}
                </Flexbox>
              </Tooltip>
            )}
            {pricing?.writeCacheInput && (
              <Tooltip
                title={`缓存输入写入 ${formatPrice.writeCacheInput}/积分 · $${formatPrice.writeCacheInput}/M`}
              >
                <Flexbox gap={2} horizontal>
                  <Icon icon={BookUp2Icon} />
                  {formatPrice.writeCacheInput}
                </Flexbox>
              </Tooltip>
            )}
            <Tooltip
              title={`输入 ${formatPrice.input}/积分 · $${formatPrice.input}/M`}
            >
              <Flexbox gap={2} horizontal>
                <Icon icon={ArrowUpFromDot} />
                {formatPrice.input}
              </Flexbox>
            </Tooltip>
            <Tooltip
              title={`输出 ${formatPrice.output}/积分 · $${formatPrice.output}/M`}
            >
              <Flexbox gap={2} horizontal>
                <Icon icon={ArrowDownToDot} />
                {formatPrice.output}
              </Flexbox>
            </Tooltip>
          </Flexbox>
        </Flexbox>
      ) : (
        <div style={{ height: 18 }} />
      )}
    </Flexbox>
  );
});

export default ModelCard;
