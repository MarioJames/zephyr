import { Alert, CopyButton, Highlighter, Icon, Markdown, Segmented } from '@lobehub/ui';
import { Descriptions, Typography } from 'antd';
import { createStyles } from 'antd-style';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { memo, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import { CRAWL_CONTENT_LIMITED_COUNT } from '@/tools/web-browsing/const';
import { CrawlResult } from '@/types/tool/crawler';

const useStyles = createStyles(({ token, css }) => {
  return {
    cardBody: css`
      padding-block: 12px 8px;
      padding-inline: 16px;
    `,
    container: css`
      cursor: pointer;

      overflow: hidden;

      max-width: 360px;
      border: 1px solid ${token.colorBorderSecondary};
      border-radius: 12px;

      transition: border-color 0.2s;

      :hover {
        border-color: ${token.colorPrimary};
      }
    `,
    description: css`
      margin-block: 0 4px !important;
      color: ${token.colorTextSecondary};
    `,
    detailsSection: css`
      padding-block: ${token.paddingSM}px;
    `,
    externalLink: css`
      color: ${token.colorPrimary};
    `,
    footer: css`
      padding: ${token.paddingXS}px;
      border-radius: 6px;
      text-align: center;
      background-color: ${token.colorFillQuaternary};
    `,
    footerText: css`
      font-size: ${token.fontSizeSM}px;
      color: ${token.colorTextTertiary} !important;
    `,
    metaInfo: css`
      display: flex;
      align-items: center;
      color: ${token.colorTextSecondary};
    `,
    sliced: css`
      color: ${token.colorTextQuaternary};
    `,
    title: css`
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;

      margin-block-end: 0;

      font-size: 16px;
      font-weight: bold;
    `,
    titleRow: css`
      color: ${token.colorText};
    `,

    url: css`
      color: ${token.colorTextTertiary};
    `,
  };
});

enum DisplayType {
  Raw = 'raw',
  Render = 'render',
}

interface PageContentProps {
  messageId: string;
  result?: CrawlResult;
}

const PageContent = memo<PageContentProps>(({ result }) => {
  const { styles } = useStyles();
  const [display, setDisplay] = useState<DisplayType>(DisplayType.Render);

  if (!result || !result.data) return undefined;

  if ('errorType' in result.data) {
    return (
      <Flexbox className={styles.footer} gap={4}>
        <div>
          <Descriptions
            classNames={{
              content: styles.footerText,
            }}
            column={1}
            items={[
              {
                children: result.crawler,
                label: '爬虫',
              },
            ]}
            size="small"
          />
        </div>
        <Alert
          extra={
            <div style={{ maxWidth: 500, overflowX: 'scroll' }}>
              <Highlighter language={'json'}>{JSON.stringify(result.data, null, 2)}</Highlighter>
            </div>
          }
          message={
            <div style={{ textAlign: 'start' }}>
              {result.data.errorMessage || result.data.content}
            </div>
          }
          type={'error'}
        />
      </Flexbox>
    );
  }

  const { url, title, description, content } = result.data;
  return (
    <Flexbox gap={24}>
      <Flexbox gap={8}>
        <Flexbox
          align={'center'}
          className={styles.titleRow}
          gap={24}
          horizontal
          justify={'space-between'}
        >
          <Flexbox>
            <div className={styles.title}>{title || result.originalUrl}</div>
          </Flexbox>
        </Flexbox>
        {description && (
          <Typography.Paragraph
            className={styles.description}
            ellipsis={{ expandable: false, rows: 4 }}
          >
            {description}
          </Typography.Paragraph>
        )}
        <Flexbox align={'center'} className={styles.url} gap={4} horizontal>
          {result.data.siteName && <div>{result.data.siteName} · </div>}
          <Link
            className={styles.url}
            href={url}
            onClick={(e) => e.stopPropagation()}
            rel={'nofollow'}
            style={{ display: 'flex', gap: 4 }}
            target={'_blank'}
          >
            {result.originalUrl}
            <Icon icon={ExternalLink} />
          </Link>
        </Flexbox>

        <div className={styles.footer}>
          <Descriptions
            classNames={{
              content: styles.footerText,
            }}
            column={2}
            items={[
              {
                children: result.data.content?.length,
                label: '字数',
              },
              {
                children: result.crawler,
                label: '爬虫',
              },
            ]}
            size="small"
          />
        </div>
      </Flexbox>
      {content && (
        <Flexbox gap={12} paddingBlock={'0 12px'}>
          <Flexbox horizontal justify={'space-between'}>
            <Segmented
              onChange={(value) => setDisplay(value as DisplayType)}
              options={[
                { label: '预览', value: DisplayType.Render },
                { label: '原始内容', value: DisplayType.Raw },
              ]}
              value={display}
              variant={'filled'}
            />
            <CopyButton content={content} />
          </Flexbox>
          {content.length > CRAWL_CONTENT_LIMITED_COUNT && (
            <Alert
              message={`内容过长，仅展示前 ${CRAWL_CONTENT_LIMITED_COUNT} 字符`}
              variant={'borderless'}
            />
          )}
          {display === DisplayType.Render ? (
            <Markdown variant={'chat'}>{content}</Markdown>
          ) : (
            <div style={{ paddingBlock: '0 12px' }}>
              {content.length < CRAWL_CONTENT_LIMITED_COUNT ? (
                content
              ) : (
                <>
                  <span>{content.slice(0, CRAWL_CONTENT_LIMITED_COUNT)}</span>
                  <span className={styles.sliced}>
                    {content.slice(CRAWL_CONTENT_LIMITED_COUNT, -1)}
                  </span>
                </>
              )}
            </div>
          )}
        </Flexbox>
      )}
    </Flexbox>
  );
});

export default PageContent;
