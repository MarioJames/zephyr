import React, { useState } from 'react';
import { Row, Col, Modal, Typography, Flex } from 'antd';
import { Button } from '@lobehub/ui';
import { Flexbox } from 'react-layout-kit';
import { Bot } from 'lucide-react';
import { useChatStore } from '@/store/chat';
import { AgentSuggestionItem } from '@/services/agent_suggestions';
import { useAIHintStyles } from '../style';
import BubblesLoading from '@/components/Loading/BubblesLoading';
import SkeletonList from './SkeletonList';

const { Paragraph } = Typography;

function AIHintItem({
  item,
  isLatest,
}: {
  item: AgentSuggestionItem;
  isLatest: boolean;
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState<{
    title: string;
    desc: string;
  } | null>(null);
  const { styles } = useAIHintStyles();
  const { acceptSuggestion, isLoading } = useChatStore();

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 获取知识点作为卡片展示
  const getKnowledgeCards = () => {
    const knowledges = item.suggestion?.knowledges || {};
    const cards = [];

    if (knowledges.finance)
      cards.push({ title: '金融知识', desc: knowledges.finance });
    if (knowledges.psychology)
      cards.push({ title: '心理知识', desc: knowledges.psychology });
    if (knowledges.korea)
      cards.push({ title: '韩国知识', desc: knowledges.korea });
    if (knowledges.role)
      cards.push({ title: '角色背景', desc: knowledges.role });

    // 补充其他知识类型
    Object.entries(knowledges).forEach(([key, value]) => {
      if (!['finance', 'psychology', 'korea', 'role'].includes(key) && value) {
        cards.push({ title: key, desc: value });
      }
    });

    return cards;
  };

  const knowledgeCards = getKnowledgeCards();

  // 处理采用建议
  const handleAcceptSuggestion = async (content: string) => {
    try {
      await acceptSuggestion(content);
    } catch (error) {
      console.error('采用建议失败:', error);
    }
  };

  return (
    <Flexbox>
      {/* 分割线日期 */}
      <div className={styles.dividerDate}>
        <div className={styles.dividerLine} />
        <span className={styles.dividerText}>
          {item.placeholder ? 'AI生成中...' : formatDate(item.createdAt || '')}
        </span>
        <div className={styles.dividerLine} />
      </div>
      {item.placeholder ? (
        <Flexbox
          horizontal
          align='center'
          justify='center'
          style={{ marginTop: 10, marginBottom: 16 }}
        >
          <BubblesLoading />
        </Flexbox>
      ) : (
        <>
          {/* 上方提示语 */}
          <div className={styles.hint}>
            {item.suggestion?.summary}
            {/。，！？：；/.test(item.suggestion?.summary || '') ? (
              <span>建议这样回复：</span>
            ) : (
              <span>，建议这样回复：</span>
            )}
          </div>

          {/* 知识点卡片 */}
          {knowledgeCards.length > 0 && (
            <Row gutter={[8, 8]} className={styles.cardGrid}>
              {knowledgeCards.slice(0, 4).map((card, idx) => (
                <Col span={12} key={idx}>
                  <div
                    className={styles.cardItem}
                    style={{ height: '100%', width: '100%', cursor: 'pointer' }}
                    onClick={() => {
                      setSelectedCard(card);
                      setModalVisible(true);
                    }}
                  >
                    <div className={styles.cardTitle}>{card.title}</div>
                    <div
                      className={styles.cardDesc}
                      style={{ WebkitLineClamp: 3 }}
                    >
                      {card.desc}
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          )}

          <div className={styles.suggestTitle}>建议这样回复：</div>

          {/* 推荐话术列表 */}
          {item.suggestion?.responses?.map((response, idx) => (
            <div key={idx} className={styles.sectionCard}>
              <div className={styles.sectionTitle}>{response.type}</div>
              <div className={styles.sectionContent}>
                <Paragraph
                  ellipsis={{
                    rows: 3,
                    expandable: true,
                    symbol: '展开',
                    onExpand: () => {},
                  }}
                >
                  {response.content}
                </Paragraph>
                {isLatest && (
                  <div className={styles.sectionFooter}>
                    <Button
                      type='primary'
                      loading={isLoading}
                      className={styles.adoptBtn}
                      onClick={() => handleAcceptSuggestion(response.content)}
                    >
                      采用
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </>
      )}

      {/* 知识卡片详情弹窗 */}
      <Modal
        centered
        width={440}
        footer={false}
        destroyOnHidden
        open={modalVisible}
        title={selectedCard?.title}
        onCancel={() => setModalVisible(false)}
      >
        <div
          style={{ padding: '16px 0', lineHeight: '24px', fontSize: '14px' }}
        >
          {selectedCard?.desc}
        </div>
      </Modal>
    </Flexbox>
  );
}

const AIHintPanel = () => {
  const { styles } = useAIHintStyles();

  // 获取当前 topic 的建议数据和加载状态
  const {
    isGeneratingAI,
    suggestions,
    isLoading: isFetchingAI,
  } = useChatStore();

  // 找到最新建议（按时间戳最大的）
  const latestSuggestion =
    suggestions.length > 0
      ? suggestions.reduce((latest, current) =>
          new Date(current.createdAt || 0).getTime() >
          new Date(latest.createdAt || 0).getTime()
            ? current
            : latest
        )
      : null;

  return (
    <Flexbox height='100%' className={styles.panelBg}>
      {/* Header */}
      <Flexbox horizontal align='center' className={styles.header}>
        <Flexbox horizontal align='center' gap={8}>
          <Bot size={20} />
          <span className={styles.headerTitle}>AI提示</span>
        </Flexbox>
      </Flexbox>
      {/* List */}
      <Flexbox flex={1} className={styles.listWrap}>
        {isFetchingAI ? (
          <SkeletonList />
        ) : (
          <>
            {suggestions.length === 0 && !isGeneratingAI && (
              <Flexbox
                align='center'
                justify='center'
                style={{ height: '100%', color: '#999', fontSize: 14 }}
              >
                暂无AI建议
              </Flexbox>
            )}
            {suggestions.map((item) => (
              <AIHintItem
                key={item.id}
                item={item}
                isLatest={latestSuggestion?.id === item.id}
              />
            ))}
          </>
        )}
      </Flexbox>
    </Flexbox>
  );
};

export default AIHintPanel;
