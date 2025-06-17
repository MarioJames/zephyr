import React, { useState } from 'react';
import { Button } from 'antd';
import { Flexbox } from 'react-layout-kit';
import { Bot, ChevronDown, ChevronUp } from 'lucide-react';

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

  return (
    <Flexbox style={{ marginBottom: 24 }}>
      {/* 分割线日期 */}
      <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0' }}>
        <div style={{ flex: 1, height: 1, background: '#E5E6EB' }} />
        <span style={{ margin: '0 16px', color: '#888', fontSize: 13 }}>
          {item.date}
        </span>
        <div style={{ flex: 1, height: 1, background: '#E5E6EB' }} />
      </div>
      {/* 上方提示语 */}
      <div style={{ fontWeight: 400, fontSize: 14, margin:'8px 8px 12px 8px', color: 'rgba(0, 0, 0, 0.65)', lineHeight: '22px' }}>{item.hint}</div>
      {/* 2*2 栅格卡片 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 164px)',
          gridTemplateRows: 'repeat(2, 84px)',
          gap: 8,
        }}
      >
        {item.cards.map((card, idx) => (
          <div
            key={idx}
            style={{
              padding: '6px 12px',
              borderRadius: 6,
              border: '1px solid rgba(0,0,0,0.06)',
              background: '#fff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              width: 164,
              height: 84,
            }}
          >
            <div style={{ fontWeight: 500, fontSize: 12, marginBottom: 4 }}>{card.title}</div>
            <div
              style={{
                color: 'rgba(0, 0, 0, 0.65)',
                fontSize: 12,
                fontWeight: 400,
                lineHeight: '20px',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                textOverflow: 'ellipsis',
              }}
            >
              {card.desc}
            </div>
          </div>
        ))}
      </div>
      <div style={{ fontWeight: 400, fontSize: 14, lineHeight: '22px', margin: '12px 0',padding:'0 8px' }}>建议这样回复：</div>
      {/* 推荐话术大卡片 */}
      <div style={{ fontWeight: 500, fontSize: 14, lineHeight: '22px', marginBottom: 4,padding:'0 8px'}}>{item.sectionTitle}</div>
      <div
        style={{
          padding: 10,
          width: '100%',
          height: 98,
          borderRadius: 6,
          background: '#E9E9E9',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            color: 'rgba(0, 0, 0, 0.65)',
            fontSize: 13,
            lineHeight: '22px',
            fontWeight: 400,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: expand ? 10 : 3,
            WebkitBoxOrient: 'vertical',
            textOverflow: 'ellipsis',
            marginBottom: 10,
          }}
        >
          {item.sectionDesc}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span
            style={{
              color: 'rgba(0, 0, 0, 0.45)',
              fontSize: 12,
              fontWeight: 400,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            onClick={() => setExpand((v) => !v)}
          >
            {expand ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {expand ? '收起' : '展开'}
          </span>
          <Button type="primary">采用</Button>
        </div>
      </div>
    </Flexbox>
  );
}

const AIHintPanel = () => {
  return (
    <Flexbox height="100%" style={{ background: '#fff' }}>
      {/* Header */}
      <Flexbox
        horizontal
        align="center"
        style={{ height: 56, padding: '0 24px' }}
      >
        <Flexbox horizontal align="center" gap={8}>
          <Bot size={20} />
          <span style={{ fontWeight: 500, fontSize: 14 }}>AI提示</span>
        </Flexbox>
      </Flexbox>
      {/* List */}
      <Flexbox flex={1} style={{ overflowY: 'auto', padding: '8px 24px' }}>
        {mockData.map((item) => (
          <AIHintItem key={item.id} item={item} />
        ))}
      </Flexbox>
    </Flexbox>
  );
};

export default AIHintPanel; 