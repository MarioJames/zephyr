import React from 'react';
import { createStyles } from 'antd-style';
import { useAgentStore } from '@/store/agent/store';
import { Button, Image } from '@lobehub/ui';
import { HELLO_IMG } from '@/const/base';
import { useRouter } from 'next/navigation';
import { useGlobalStore } from '@/store/global';
import { globalSelectors } from '@/store/global/selectors';

const useStyles = createStyles(({ css, token }) => ({
  container: css`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    box-sizing: border-box;
  `,
  helloImg: css`
    margin-right: 16px;
  `,
  top: css`
    font-size: 32px;
    font-weight: 600;
    color: ${token.colorText};
    margin-bottom: 16px;
    text-align: center;
  `,
  middle: css`
    font-size: 14px;
    color: ${token.colorTextSecondary};
    margin-bottom: 32px;
    text-align: center;
  `,
  cardList: css`
    max-width: 820px;
    display: flex;
    flex-direction: row;
    gap: 24px;
    overflow-x: auto;
    justify-content: flex-start;
    scrollbar-width: thin;
    margin: 0 auto;
  `,
  card: css`
    width: 240px;
    flex: 0 0 240px;
    background: ${token.colorBgElevated};
    border: 1px solid ${token.colorBorder};
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px;
    box-sizing: border-box;
  `,
  avatar: css`
    width: 100%;
    border-radius: 4px;
    margin-bottom: 16px;
    overflow: hidden;
    object-fit: cover;
  `,
  cardTitle: css`
    font-size: 20px;
    font-weight: 500;
    color: ${token.colorText};
    margin-bottom: 16px;
    text-align: center;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  cardDesc: css`
    font-size: 14px;
    font-weight: 400;
    color: ${token.colorTextSecondary};
    margin-bottom: 16px;
    text-align: center;
    width: 100%;
    height: 40px;
    line-height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-word;
  `,
  cardFooter: css`
    width: 100%;
    display: flex;
    justify-content: center;
  `,
}));

const DefaultCreateCustomer = () => {
  const { styles } = useStyles();
  const agents = useAgentStore((s) => s.agents);
  const currentUser = useGlobalStore(globalSelectors.currentUser);
  const router = useRouter();

  const onCreateCustomer = (agentId?: string) => {
    if (agentId) {
      router.push(`/customer/form?agentId=${agentId}`);
    } else {
      router.push('/customer/form');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Image
          alt='agent'
          className={styles.helloImg}
          height={40}
          src={HELLO_IMG}
          width={40}
        />
        Hi！ {currentUser?.fullName || currentUser?.username || ''}
      </div>
      <div className={styles.middle}>
        我是您的私人智能助理，点击下方客户类型开始创建您的客户吧~
      </div>
      {agents && agents.length > 0 ? (
        <div className={styles.cardList}>
          {agents.map((agent) => (
            <div className={styles.card} key={agent.id}>
              <Image
                alt={agent.title || ''}
                className={styles.avatar}
                height={96}
                src={agent.avatar || '/test.png'}
                width={96}
              />
              <div className={styles.cardTitle}>{agent.title}</div>
              <div className={styles.cardDesc}>{agent.description}</div>
              <div
                className={styles.cardFooter}
                onClick={() => onCreateCustomer(agent.id)}
              >
                <Button type='primary'>创建</Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.cardFooter}>
          <Button
            onClick={() => onCreateCustomer()}
            size='large'
            type='primary'
          >
            创建客户
          </Button>
        </div>
      )}
    </div>
  );
};

export default DefaultCreateCustomer;
