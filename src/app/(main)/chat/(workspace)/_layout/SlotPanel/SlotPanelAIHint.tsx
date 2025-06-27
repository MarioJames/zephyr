import React, { useState, useEffect } from 'react';
import { Button, Row, Col } from 'antd';
import { Flexbox } from 'react-layout-kit';
import { Bot, ChevronDown, ChevronUp } from 'lucide-react';
import { useChatStore } from '@/store/chat';
import { suggestionsSelectors } from '@/store/chat/slices/agent_suggestions/selectors';
import { AgentSuggestionItem } from '@/services/agent_suggestions';
import { useAIHintStyles } from './style';

function AIHintItem({ item }: { item: AgentSuggestionItem }) {
  const [expand, setExpand] = useState(false);
  const { styles } = useAIHintStyles();

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // 获取知识点作为卡片展示
  const getKnowledgeCards = () => {
    const knowledges = item.suggestion.knowledges;
    const cards = [];
    
    if (knowledges.finance) cards.push({ title: '金融知识', desc: knowledges.finance });
    if (knowledges.psychology) cards.push({ title: '心理知识', desc: knowledges.psychology });
    if (knowledges.korea) cards.push({ title: '韩国知识', desc: knowledges.korea });
    if (knowledges.role) cards.push({ title: '角色背景', desc: knowledges.role });
    
    // 补充其他知识类型
    Object.entries(knowledges).forEach(([key, value]) => {
      if (!['finance', 'psychology', 'korea', 'role'].includes(key) && value) {
        cards.push({ title: key, desc: value });
      }
    });
    
    return cards;
  };

  const knowledgeCards = getKnowledgeCards();

  return (
    <Flexbox>
      {/* 分割线日期 */}
      <div className={styles.dividerDate}>
        <div className={styles.dividerLine} />
        <span className={styles.dividerText}>{formatDate(item.createdAt)}</span>
        <div className={styles.dividerLine} />
      </div>
      {/* 上方提示语 */}
      <div className={styles.hint}>{item.suggestion.summary}</div>
      
      {/* 知识点卡片 */}
      {knowledgeCards.length > 0 && (
        <Row gutter={[8, 8]} className={styles.cardGrid}>
          {knowledgeCards.slice(0, 4).map((card, idx) => (
            <Col span={12} key={idx}>
              <div className={styles.cardItem} style={{ height: '100%', width: '100%' }}>
                <div className={styles.cardTitle}>{card.title}</div>
                <div className={styles.cardDesc} style={{ WebkitLineClamp: 3 }}>{card.desc}</div>
              </div>
            </Col>
          ))}
        </Row>
      )}
      
      <div className={styles.suggestTitle}>AI推荐回复：</div>
      
      {/* 推荐话术列表 */}
      {item.suggestion.responses.map((response, idx) => (
        <div key={idx} className={styles.sectionCard}>
          <div className={styles.sectionTitle}>{response.type}</div>
          <div
            className={expand ? styles.sectionDescExpand : styles.sectionDesc}
          >
            {response.content}
          </div>
          <div className={styles.sectionFooter}>
            <span className={styles.expandBtn} onClick={() => setExpand((v) => !v)}>
              {expand ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              {expand ? '收起' : '展开'}
            </span>
            <Button className={styles.adoptBtn} type="primary">采用</Button>
          </div>
        </div>
      ))}
    </Flexbox>
  );
}

const AIHintPanel = () => {
  const { styles } = useAIHintStyles();
  
  // 获取当前 topic 的建议数据
  const suggestions = useChatStore(suggestionsSelectors.suggestionsSortedByTime);
  const isGeneratingAI = useChatStore(suggestionsSelectors.isGeneratingAI);
  const suggestionsInit = useChatStore(suggestionsSelectors.suggestionsInit);
  const activeId = useChatStore((s) => s.activeId);
  const fetchSuggestions = useChatStore((s) => s.fetchSuggestions);

  // 获取建议数据
  useEffect(() => {
    if (activeId && !suggestionsInit) {
      fetchSuggestions(activeId);
    }
  }, [activeId, suggestionsInit, fetchSuggestions]);

  return (
    <Flexbox height="100%" className={styles.panelBg}>
      {/* Header */}
      <Flexbox
        horizontal
        align="center"
        className={styles.header}
      >
        <Flexbox horizontal align="center" gap={8}>
          <Bot size={20} />
          <span className={styles.headerTitle}>AI提示</span>
        </Flexbox>
      </Flexbox>
      {/* List */}
      <Flexbox flex={1} className={styles.listWrap}>
        {isGeneratingAI && (
          <div className={styles.loadingMsg}>AI正在生成建议...</div>
        )}
        {suggestions.length === 0 && !isGeneratingAI && (
          <div className={styles.emptyMsg}>暂无AI建议</div>
        )}
        {suggestions.map((item) => (
          <AIHintItem key={item.id} item={item} />
        ))}
      </Flexbox>
    </Flexbox>
  );
};

export default AIHintPanel; 