import React, { useState } from 'react';
import { Row, Col, Modal, Typography, App, Input } from 'antd';
import { Button } from '@lobehub/ui';
import { Flexbox } from 'react-layout-kit';
import { Bot, RefreshCw, Copy, ChevronDown, Edit2 } from 'lucide-react';
import { chatSelectors, useChatStore } from '@/store/chat';
import { AgentSuggestionItem, updateSuggestion as updateSuggestions } from '@/services/agent_suggestions';
import { useAIHintStyles } from '../style';
import SkeletonList, { SingleSkeleton } from './SkeletonList';

const unit = new Set(['。', '，', '！', '？', '：', '；']);

const { Paragraph } = Typography;

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

/**
 * 检查字符串是否以指定标点符号结尾
 * @param {string} str - 要检查的字符串
 * @returns {boolean} - 如果最后一个字符是unit中的符号则返回true，否则返回false
 */
function endsWithUnitSymbol(str: string) {
  if (typeof str !== 'string' || str.length === 0) {
    return false;
  }

  const lastChar = str.slice(-1);
  return unit.has(lastChar);
}

function AIHintItem({
  item,
  isLatest,
}: {
  item: AgentSuggestionItem;
  isLatest: boolean;
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingContent, setEditingContent] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [selectedCard, setSelectedCard] = useState<{
    title: string;
    desc: string;
  } | null>(null);
  const [adoptingIndex, setAdoptingIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedIndexes, setExpandedIndexes] = useState<Set<number>>(new Set());
  const { styles } = useAIHintStyles();
  const { acceptSuggestion, updateSuggestion } = useChatStore();
  const { message } = App.useApp();

  // 处理复制文本
  const handleCopy = async (text: string) => {
    try {
      // 优先使用 Clipboard API
      await navigator.clipboard.writeText(text);
      message.success("复制成功");
    } catch {
      // 兜底使用 DOM API
      try {
        const input = document.createElement('input');
        input.value = text;
        document.body.append(input);
        input.select();
        document.execCommand('copy');
        input.remove();
        message.success("复制成功");
      } catch (fallbackErr) {
        message.error("复制失败");
        console.error("复制失败:", fallbackErr);
      }
    }
  };

  // 处理采用建议
  const handleAcceptSuggestion = async (content: string, index: number) => {
    try {
      setAdoptingIndex(index);
      await acceptSuggestion(content);
    } catch (error) {
      console.error('采用建议失败:', error);
    } finally {
      setAdoptingIndex(null);
    }
  };

  // 处理编辑建议
  const handleEdit = (content: string, index: number) => {
    setEditingContent(content);
    setEditingIndex(index);
    setEditModalVisible(true);
  };

  // 处理保存编辑
  const handleSaveEdit = async (sendAfterSave: boolean = false) => {
    if (!item.id || editingIndex === null) return;

    setIsSaving(true);
    try {
      // 构建新的建议内容
      const newSuggestion = { ...item.suggestion };
      if (newSuggestion.responses && newSuggestion.responses[editingIndex]) {
        newSuggestion.responses[editingIndex].content = editingContent;
      }

      // 调用更新接口
      await updateSuggestions(item.id as number, newSuggestion);
      
      // 更新store中的状态
      updateSuggestion(item.id as number, {
        ...item,
        suggestion: newSuggestion,
      });

      message.success('保存成功');
      setEditModalVisible(false);

      // 如果需要发送
      if (sendAfterSave) {
        await handleAcceptSuggestion(editingContent, editingIndex);
      }
    } catch (error) {
      console.error('保存编辑失败:', error);
      message.error('保存失败');
    } finally {
      setIsSaving(false);
    }
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

  // 生成中时，不显示
  if (item.placeholder) {
    return null;
  }

  return (
    <Flexbox>
      {/* 分割线日期 */}
      <div className={styles.dividerDate}>
        <div className={styles.dividerLine} />
        <span className={styles.dividerText}>
          {formatDate(item.createdAt || '')}
        </span>
        <div className={styles.dividerLine} />
      </div>
      <div className={styles.hint}>
        {item.suggestion?.summary}
        {endsWithUnitSymbol(item.suggestion?.summary || '') ? (
          <span>建议这样回复：</span>
        ) : (
          <span>，建议这样回复：</span>
        )}
      </div>

      {/* 知识点卡片 */}
      {knowledgeCards.length > 0 && (
        <Row className={styles.cardGrid} gutter={[8, 8]}>
          {knowledgeCards.slice(0, 4).map((card, idx) => (
            <Col key={idx} span={12}>
              <div
                className={styles.cardItem}
                onClick={() => {
                  setSelectedCard(card);
                  setModalVisible(true);
                }}
                style={{ height: '100%', width: '100%', cursor: 'pointer' }}
              >
                <div className={styles.cardTitle}>{card.title}</div>
                <div className={styles.cardDesc} style={{ WebkitLineClamp: 3 }}>
                  {card.desc}
                </div>
              </div>
            </Col>
          ))}
        </Row>
      )}

      <div className={styles.suggestTitle}>建议这样回复：</div>

      {/* 推荐话术列表 */}
      {item.suggestion?.responses?.map((response, idx) => {
        const isExpanded = expandedIndexes.has(idx);
        const toggleExpand = () => {
          setExpandedIndexes((prev) => {
            const next = new Set(prev);
            if (next.has(idx)) next.delete(idx);
            else next.add(idx);
            return next;
          });
        };

        return (
          <div className={styles.sectionCard} key={idx}>
            <div className={styles.sectionTitle}>{response.type}</div>
            <div className={styles.sectionContent}>
              {isExpanded ? (
                <Paragraph>{response.content}</Paragraph>
              ) : (
                <Paragraph ellipsis={{ rows: 3 }}>{response.content}</Paragraph>
              )}
              <Flexbox align='center' horizontal justify='space-between' style={{ marginTop: 8 }}>
                <div
                  onClick={toggleExpand}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    color: '#666',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                >
                  <ChevronDown
                    size={14}
                    style={{
                      transform: isExpanded ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s ease',
                    }}
                  />
                  <span>{isExpanded ? '收起' : '展开'}</span>
                </div>
                <div className={styles.sectionFooter}>
                  {isLatest && (
                    <>
                      <Edit2
                        size={16}
                        className={styles.editBtn}
                        onClick={() => handleEdit(response.content, idx)}
                      />
                      <Copy
                        size={16}
                        className={styles.copyBtn}
                        onClick={() => handleCopy(response.content)}
                      />
                      <Button
                        className={styles.adoptBtn}
                        loading={adoptingIndex === idx}
                        onClick={() => handleAcceptSuggestion(response.content, idx)}
                        type='primary'
                      >
                        采用
                      </Button>
                    </>
                  )}
                </div>
              </Flexbox>
            </div>
          </div>
        );
      })}

      {/* 知识卡片详情弹窗 */}
      <Modal
        centered
        destroyOnHidden
        footer={false}
        onCancel={() => setModalVisible(false)}
        open={modalVisible}
        title={selectedCard?.title}
        width={440}
      >
        <div
          style={{ padding: '16px 0', lineHeight: '24px', fontSize: '14px' }}
        >
          {selectedCard?.desc}
        </div>
      </Modal>

      {/* 编辑弹窗 */}
      <Modal
        title="编辑建议"
        closable={false}
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setEditModalVisible(false)}>
            取消
          </Button>,
          <Button
            key="save"
            type="default"
            loading={isSaving}
            onClick={() => handleSaveEdit(false)}
          >
            保存
          </Button>,
          <Button
            key="saveAndSend"
            type="primary"
            loading={isSaving}
            onClick={() => handleSaveEdit(true)}
          >
            保存并发送
          </Button>,
        ]}
        width={600}
      >
        <Input.TextArea
          value={editingContent}
          onChange={(e) => setEditingContent(e.target.value)}
          rows={10}
          style={{ marginTop: 16, resize: 'none' }}
        />
      </Modal>
    </Flexbox>
  );
}

const AIHintPanel = () => {
  const { message } = App.useApp();
  const { styles } = useAIHintStyles();
  const listRef = React.useRef<HTMLDivElement>(null);

  // 获取当前 topic 的建议数据和加载状态
  const [
    isGeneratingAI,
    suggestions,
    isFetchingAI,
    messages,
    generateAISuggestion,
  ] = useChatStore((s) => [
    chatSelectors.isGeneratingAI(s),
    chatSelectors.suggestionsSortedByTime(s),
    chatSelectors.suggestionsLoading(s),
    chatSelectors.messages(s),
    s.generateAISuggestion,
  ]);

  // 监听生成状态变化，滚动到顶部
  React.useEffect(() => {
    if (isGeneratingAI && listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }, [isGeneratingAI]);

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

  // 获取最新用户消息ID
  const getLatestUserMessageId = () => {
    const userMessages = messages
      .filter((msg) => msg.role === 'user')
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      );

    return userMessages.length > 0 ? userMessages[0].id : null;
  };

  // 处理重新生成
  const handleRegenerate = async () => {
    const latestUserMessageId = getLatestUserMessageId();
    if (!latestUserMessageId) {
      console.warn('没有找到用户消息，无法重新生成建议');
      return;
    }

    try {
      const { success } = await generateAISuggestion(latestUserMessageId);
      if (!success) {
        message.error('重新生成建议失败');
        return;
      }

      message.success('重新生成建议成功');
    } catch (error) {
      console.error('重新生成建议失败:', error);
    }
  };

  // 判断是否应该显示重新生成按钮
  const shouldShowRegenerateButton = () => {
    // 如果正在生成中，不显示
    if (isGeneratingAI || isFetchingAI) return false;

    // 如果没有消息，不显示
    const latestUserMessageId = getLatestUserMessageId();
    if (!latestUserMessageId) return false;

    // 总是显示重新生成按钮，允许用户在以下情况重新生成：
    // 1. 没有建议
    // 2. 有建议但想重新生成
    // 3. 生成失败的情况
    return true;
  };

  return (
    <Flexbox className={styles.panelBg} height='100%'>
      {/* Header */}
      <Flexbox align='center' className={styles.header} horizontal>
        <Flexbox align='center' gap={8} horizontal>
          <Bot size={20} />
          <span className={styles.headerTitle}>AI提示</span>
        </Flexbox>
        {/* 重新生成按钮 */}
        {shouldShowRegenerateButton() && (
          <Button
            disabled={isGeneratingAI}
            icon={<RefreshCw size={16} />}
            onClick={handleRegenerate}
            size='small'
            style={{
              marginLeft: 'auto',
              color: '#666',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
            type='text'
          >
            重新生成
          </Button>
        )}
      </Flexbox>
      {/* List */}
      <Flexbox className={styles.listWrap} flex={1} ref={listRef}>
        {isFetchingAI ? (
          <SkeletonList />
        ) : (
          <>
            {isGeneratingAI && <SingleSkeleton />}
            {suggestions.length === 0 && !isGeneratingAI && (
              <Flexbox
                align='center'
                justify='center'
                style={{ height: '100%', color: '#999', fontSize: 14 }}
              >
                <Flexbox align='center' gap={16}>
                  <div>暂无AI建议</div>
                  {shouldShowRegenerateButton() && (
                    <Button
                      icon={<RefreshCw size={16} />}
                      loading={isGeneratingAI}
                      onClick={handleRegenerate}
                      type='primary'
                    >
                      生成建议
                    </Button>
                  )}
                </Flexbox>
              </Flexbox>
            )}
            {suggestions.map((item) => (
              <AIHintItem
                isLatest={latestSuggestion?.id === item.id}
                item={item}
                key={item.id}
              />
            ))}
          </>
        )}
      </Flexbox>
    </Flexbox>
  );
};

export default AIHintPanel;
