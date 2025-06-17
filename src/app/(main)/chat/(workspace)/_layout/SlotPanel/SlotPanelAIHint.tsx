import React, { useState } from 'react';
import { Button } from 'antd';
import { Flexbox } from 'react-layout-kit';
import { Bot, ChevronDown, ChevronUp } from 'lucide-react';
import { useAIHintStyles } from './style';

const mockData = [
  {
    id: 1,
    date: '2024-05-01 14:23',
    hint: '客户需要开票相关的流程，建议这样回复：',
    cards: [
      { title: '步骤一', desc: '请先准备好相关发票资料，包括公司抬头、税号、地址、电话等信息。' },
      { title: '步骤二', desc: '登录企业财务系统，进入发票申请模块，填写相关信息并提交。' },
      { title: '步骤三', desc: '等待财务审核，审核通过后会生成电子发票。' },
      { title: '步骤四', desc: '下载电子发票并发送给客户，或按需邮寄纸质发票。' },
    ],
    sectionTitle: 'AI推荐话术',
    sectionDesc:
      '您好，关于开票流程，您可以按照以下步骤操作：1.准备资料 2.系统申请 3.审核 4.下载发票。如有疑问请随时联系。',
  },
  {
    id: 2,
    date: '2024-05-02 09:10',
    hint: '客户需要报销相关的流程，建议这样回复：',
    cards: [
      { title: '准备材料', desc: '请准备好发票原件、报销单据及相关审批文件。' },
      { title: '系统录入', desc: '登录OA系统，填写报销申请并上传相关材料。' },
      { title: '审批流程', desc: '提交后将进入部门负责人及财务审批流程。' },
      { title: '款项发放', desc: '审批通过后，财务将在3个工作日内完成打款。' },
    ],
    sectionTitle: 'AI推荐话术',
    sectionDesc:
      '您好，报销流程如下：1.准备材料 2.系统申请 3.审批 4.打款。如有疑问请随时联系。',
  },
];

function AIHintItem({ item }: { item: typeof mockData[0] }) {
  const [expand, setExpand] = useState(false);
  const { styles } = useAIHintStyles();

  return (
    <Flexbox>
      {/* 分割线日期 */}
      <div className={styles.dividerDate}>
        <div className={styles.dividerLine} />
        <span className={styles.dividerText}>{item.date}</span>
        <div className={styles.dividerLine} />
      </div>
      {/* 上方提示语 */}
      <div className={styles.hint}>{item.hint}</div>
      {/* 2*2 栅格卡片 */}
      <div className={styles.cardGrid}>
        {item.cards.map((card, idx) => (
          <div key={idx} className={styles.cardItem}>
            <div className={styles.cardTitle}>{card.title}</div>
            <div className={styles.cardDesc}>{card.desc}</div>
          </div>
        ))}
      </div>
      <div className={styles.suggestTitle}>建议这样回复：</div>
      {/* 推荐话术大卡片 */}
      <div className={styles.sectionTitle}>{item.sectionTitle}</div>
      <div className={styles.sectionCard}>
        <div className={expand ? styles.sectionDescExpand : styles.sectionDesc}>{item.sectionDesc}</div>
        <div className={styles.sectionFooter}>
          <span className={styles.expandBtn} onClick={() => setExpand((v) => !v)}>
            {expand ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {expand ? '收起' : '展开'}
          </span>
          <Button className={styles.adoptBtn} type="primary">采用</Button>
        </div>
      </div>
    </Flexbox>
  );
}

const AIHintPanel = () => {
  const { styles } = useAIHintStyles();
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
        {mockData.map((item) => (
          <AIHintItem key={item.id} item={item} />
        ))}
      </Flexbox>
    </Flexbox>
  );
};

export default AIHintPanel; 