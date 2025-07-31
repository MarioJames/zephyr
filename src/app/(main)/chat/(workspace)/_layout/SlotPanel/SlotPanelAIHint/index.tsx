import React, { useState } from "react";
import { Row, Col, Modal, Typography } from "antd";
import { Button } from "@lobehub/ui";
import { Flexbox } from "react-layout-kit";
import { Bot, RefreshCw } from "lucide-react";
import { chatSelectors, useChatStore } from "@/store/chat";
import { AgentSuggestionItem } from "@/services/agent_suggestions";
import { useAIHintStyles } from "../style";
import BubblesLoading from "@/components/Loading/BubblesLoading";
import SkeletonList from "./SkeletonList";

const unit = new Set(["。", "，", "！", "？", "：", "；"]);

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
  const { acceptSuggestion } = useChatStore();

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 获取知识点作为卡片展示
  const getKnowledgeCards = () => {
    const knowledges = item.suggestion?.knowledges || {};
    const cards = [];

    if (knowledges.finance)
      cards.push({ title: "金融知识", desc: knowledges.finance });
    if (knowledges.psychology)
      cards.push({ title: "心理知识", desc: knowledges.psychology });
    if (knowledges.korea)
      cards.push({ title: "韩国知识", desc: knowledges.korea });
    if (knowledges.role)
      cards.push({ title: "角色背景", desc: knowledges.role });

    // 补充其他知识类型
    Object.entries(knowledges).forEach(([key, value]) => {
      if (!["finance", "psychology", "korea", "role"].includes(key) && value) {
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
      console.error("采用建议失败:", error);
    }
  };

  /**
   * 检查字符串是否以指定标点符号结尾
   * @param {string} str - 要检查的字符串
   * @returns {boolean} - 如果最后一个字符是unit中的符号则返回true，否则返回false
   */
  function endsWithUnitSymbol(str: string) {
    if (typeof str !== "string" || str.length === 0) {
      return false;
    }

    const lastChar = str.slice(-1);
    return unit.has(lastChar);
  }

  return (
    <Flexbox>
      {/* 分割线日期 */}
      <div className={styles.dividerDate}>
        <div className={styles.dividerLine} />
        <span className={styles.dividerText}>
          {item.placeholder ? "AI生成中..." : formatDate(item.createdAt || "")}
        </span>
        <div className={styles.dividerLine} />
      </div>
      {item.placeholder ? (
        <Flexbox
          align="center"
          horizontal
          justify="center"
          style={{ marginTop: 10, marginBottom: 16 }}
        >
          <BubblesLoading />
        </Flexbox>
      ) : (
        <>
          {/* 上方提示语 */}
          <div className={styles.hint}>
            {item.suggestion?.summary}
            {endsWithUnitSymbol(item.suggestion?.summary || "") ? (
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
                    style={{ height: "100%", width: "100%", cursor: "pointer" }}
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
            <div className={styles.sectionCard} key={idx}>
              <div className={styles.sectionTitle}>{response.type}</div>
              <div className={styles.sectionContent}>
                <Paragraph
                  ellipsis={{
                    rows: 3,
                    expandable: true,
                    symbol: "展开",
                    onExpand: () => {},
                  }}
                >
                  {response.content}
                </Paragraph>
                {isLatest && (
                  <div className={styles.sectionFooter}>
                    <Button
                      className={styles.adoptBtn}
                      onClick={() => handleAcceptSuggestion(response.content)}
                      type="primary"
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
        destroyOnHidden
        footer={false}
        onCancel={() => setModalVisible(false)}
        open={modalVisible}
        title={selectedCard?.title}
        width={440}
      >
        <div
          style={{ padding: "16px 0", lineHeight: "24px", fontSize: "14px" }}
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
  const [isGeneratingAI, suggestions, isFetchingAI, messages, generateAISuggestion] = useChatStore((s) => [
    chatSelectors.isGeneratingAI(s),
    chatSelectors.suggestions(s),
    chatSelectors.suggestionsLoading(s),
    chatSelectors.messages(s),
    s.generateAISuggestion,
  ]);

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
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    
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
      await generateAISuggestion(latestUserMessageId);
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
    <Flexbox className={styles.panelBg} height="100%">
      {/* Header */}
      <Flexbox align="center" className={styles.header} horizontal>
        <Flexbox align="center" gap={8} horizontal>
          <Bot size={20} />
          <span className={styles.headerTitle}>AI提示</span>
        </Flexbox>
        {/* 重新生成按钮 */}
        {shouldShowRegenerateButton() && (
          <Button
            disabled={isGeneratingAI}
            icon={<RefreshCw size={16} />}
            onClick={handleRegenerate}
            size="small"
            style={{ 
              marginLeft: 'auto',
              color: '#666',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            type="text"
          >
            重新生成
          </Button>
        )}
      </Flexbox>
      {/* List */}
      <Flexbox className={styles.listWrap} flex={1}>
        {isFetchingAI ? (
          <SkeletonList />
        ) : (
          <>
            {suggestions.length === 0 && !isGeneratingAI && (
              <Flexbox
                align="center"
                justify="center"
                style={{ height: "100%", color: "#999", fontSize: 14 }}
              >
                <Flexbox align="center" gap={16}>
                  <div>暂无AI建议</div>
                  {shouldShowRegenerateButton() && (
                    <Button
                      icon={<RefreshCw size={16} />}
                      loading={isGeneratingAI}
                      onClick={handleRegenerate}
                      type="primary"
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
