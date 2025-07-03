'use client';

import { Icon } from '@lobehub/ui';
import { Typography } from 'antd';
import { createStyles, useTheme } from 'antd-style';
import { Database, FileImage, FileText, FileUpIcon, LibraryBig, SearchCheck } from 'lucide-react';
import Link from 'next/link';
import { Center, Flexbox } from 'react-layout-kit';

import FeatureList from '@/components/FeatureList';
import { LOBE_CHAT_CLOUD } from '@/const/branding';
import { DATABASE_SELF_HOSTING_URL, OFFICIAL_URL, UTM_SOURCE } from '@/const/url';

const { Text } = Typography;

const BLOCK_SIZE = 100;
const ICON_SIZE = { size: 72, strokeWidth: 1.5 };

const useStyles = createStyles(({ css, token }) => ({
  actionTitle: css`
    margin-block-start: 12px;
    font-size: 16px;
    color: ${token.colorTextSecondary};
  `,
  card: css`
    cursor: pointer;

    position: relative;

    overflow: hidden;

    width: 200px;
    height: 140px;
    border-radius: ${token.borderRadiusLG}px;

    font-weight: 500;
    text-align: center;

    background: ${token.colorFillTertiary};
    box-shadow: 0 0 0 1px ${token.colorFillTertiary} inset;

    transition: background 0.3s ease-in-out;

    &:hover {
      background: ${token.colorFillSecondary};
    }
  `,
  glow: css`
    position: absolute;
    inset-block-end: -12px;
    inset-inline-end: 0;

    width: 48px;
    height: 48px;

    opacity: 0.5;
    filter: blur(24px);
  `,

  icon: css`
    border-radius: ${token.borderRadiusLG}px;
    color: ${token.colorTextLightSolid};
  `,
  iconGroup: css`
    margin-block-start: -44px;
  `,
}));

const NotSupportClient = () => {
  const theme = useTheme();
  const { styles } = useStyles();

  const features = [
    {
      avatar: Database,
      desc: '支持主流文件类型，包括 Word、PPT、Excel、PDF、TXT 等常见文档格式，以及JS、Python 等主流代码文件',
      title: '多种文件类型解析',
    },
    {
      avatar: SearchCheck,
      desc: '使用高性能向量模型，对文本分块进行向量化，实现文件内容的语义化检索',
      title: '向量语义化',
    },
    {
      avatar: LibraryBig,
      desc: '支持创建知识库，并允许添加不同类型的文件，构建属于你的领域知识',
      title: '知识库',
    },
  ];

  return (
    <Center gap={40} height={'100%'} width={'100%'}>
      <Flexbox className={styles.iconGroup} gap={12} horizontal>
        <Center
          className={styles.icon}
          height={BLOCK_SIZE * 1.25}
          style={{
            background: theme.purple,
            transform: 'rotateZ(-20deg) translateX(10px)',
          }}
          width={BLOCK_SIZE}
        >
          <Icon icon={FileImage} size={ICON_SIZE} />
        </Center>
        <Center
          className={styles.icon}
          height={BLOCK_SIZE * 1.25}
          style={{
            background: theme.gold,
            transform: 'translateY(-22px)',
            zIndex: 1,
          }}
          width={BLOCK_SIZE}
        >
          <Icon icon={FileUpIcon} size={ICON_SIZE} />
        </Center>
        <Center
          className={styles.icon}
          height={BLOCK_SIZE * 1.25}
          style={{
            background: theme.geekblue,
            transform: 'rotateZ(20deg) translateX(-10px)',
          }}
          width={BLOCK_SIZE}
        >
          <Icon icon={FileText} size={ICON_SIZE} />
        </Center>
      </Flexbox>

      <Flexbox justify={'center'} style={{ textAlign: 'center' }}>
        <Text as={'h1'} style={{ fontSize: 32 }}>
          当前部署模式不支持文件管理
        </Text>
        <Text type={'secondary'}>
          当前部署实例为客户端数据库模式，无法使用文件管理功能。请切换到
          <Link href={DATABASE_SELF_HOSTING_URL}>服务端数据库部署模式</Link>
          ，或直接使用官方的
          <Link
            href={`${OFFICIAL_URL}?utm_source=${UTM_SOURCE}&utm_medium=client_not_support_file`}
          >
            {LOBE_CHAT_CLOUD}
          </Link>
        </Text>
      </Flexbox>

      <Flexbox style={{ marginTop: 40 }}>
        <FeatureList data={features} />
      </Flexbox>
    </Center>
  );
};

export default NotSupportClient;
