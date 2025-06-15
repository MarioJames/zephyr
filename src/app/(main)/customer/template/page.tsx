'use client';

import React from 'react';
import { Button, Card, Col, Row, Tooltip, Typography, Space, Divider } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { createStyles } from 'antd-style';
import Link from 'next/link';

interface CustomerTemplate {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
  }
  
const customerTemplates: CustomerTemplate[] = [
    {
      id: '1',
      title: 'A类客户',
      description: '适用于大型企业客户的模版，包含企业级服务支持和定制化解决方案',
      imageUrl: '/test.png',
    },
    {
      id: '2',
      title: 'A类客户',
      description: '适用于个人用户的基础模版，提供标准化服务和支持',
      imageUrl: '/test.png',
    },
    {
      id: '3',
      title: 'A类客户',
      description: '为中小型企业设计的模版，平衡了成本和服务质量',
      imageUrl: '/test.png',
    },
    {
      id: '4',
      title: 'A类客户',
      description: '针对政府部门的特殊需求定制的模版，符合相关规定和要求',
      imageUrl: '/test.png',
    },
    {
      id: '5',
      title: 'A类客户',
      description: '为学校、培训机构等教育单位设计的模版，包含教育资源管理和学生服务',
      imageUrl: '/test.png',
    },
    {
      id: '6',
      title: 'A类客户',
      description: '适用于医院、诊所等医疗机构的模版，包含患者管理和医疗服务支持',
      imageUrl: '/test.png',
    },
    {
      id: '7',
      title: 'A类客户',
      description: '为非营利组织和慈善机构设计的模版，支持公益活动和志愿者管理',
      imageUrl: '/test.png',
    },
  ]; 

const { Title, Paragraph } = Typography;

const useStyles = createStyles(({ css, token }) => ({
  container: css`
    padding: 16px 24px;
  `,
  header: css`
    height: 56px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  `,
  subHeader: css`
    height: 34px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 16px 0;
  `,
  backButton: css`
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 16px;
  `,
  cardGrid: css`
    margin-top: 16px;
  `,
  card: css`
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: 8px;
    overflow: hidden;
    height: 280px;
    display: flex;
    flex-direction: column;
  `,
  cardContent: css`
    flex: 1;
    padding: 8px;
    height: 240px;
    display: flex;
    flex-direction: column;
  `,
  cardImage: css`
    width: 100%;
    height: 132px;
    object-fit: cover;
  `,
  cardTitle: css`
    margin-top: 8px;
    font-size: 16px;
    font-weight: 500;
  `,
  cardDescription: css`
    margin-top: 4px;
    color: ${token.colorTextSecondary};
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  `,
  cardFooter: css`
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    border-top: 1px solid rgba(0, 0, 0, 0.06);
  `,
  footerButton: css`
    color: ${token.colorText};
    cursor: pointer;
    font-size: 14px;
    &:hover {
      color: ${token.colorPrimary};
    }
  `,
  footerDivider: css`
    height: 20px;
    width: 1px;
    background-color: rgba(0, 0, 0, 0.06);
  `,
  addButton: css`
    background-color: #000;
    color: #fff;
    &:hover, &:focus {
      background-color: #333;
      color: #fff;
    }
  `,
}));

export default function CustomerTemplatePage() {
  const { styles } = useStyles();

  const handleEdit = (id: string) => {
    console.log('编辑模版', id);
  };

  const handleDelete = (id: string) => {
    console.log('删除模版', id);
  };

  const handleAddType = () => {
    console.log('添加客户类型');
  };

  return (
    <div className={styles.container}>
      {/* 顶部导航 */}
      <div className={styles.header}>
        <Link href="/customer" className={styles.backButton}>
          <ArrowLeftOutlined style={{ marginRight: 8 }} />
          返回客户管理
        </Link>
      </div>

      {/* 子标题和添加按钮 */}
      <div className={styles.subHeader}>
        <Title level={4} style={{ margin: 0 }}>客户模版配置</Title>
        <Button className={styles.addButton} onClick={handleAddType}>
          添加客户类型
        </Button>
      </div>

      {/* 卡片网格 */}
      <Row gutter={[16, 16]} className={styles.cardGrid}>
        {customerTemplates.map((template) => (
          <Col xs={24} sm={12} md={8} lg={6} xl={4.8} key={template.id}>
            <div className={styles.card}>
              <div className={styles.cardContent}>
                <img 
                  src={template.imageUrl}
                  alt={template.title}
                  className={styles.cardImage} 
                />
                <div className={styles.cardTitle}>{template.title}</div>
                <Tooltip title={template.description}>
                  <div className={styles.cardDescription}>
                    {template.description}
                  </div>
                </Tooltip>
              </div>
              <div className={styles.cardFooter}>
                <span 
                  className={styles.footerButton} 
                  onClick={() => handleEdit(template.id)}
                >
                  编辑
                </span>
                <div className={styles.footerDivider} />
                <span 
                  className={styles.footerButton} 
                  onClick={() => handleDelete(template.id)}
                >
                  删除
                </span>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
}
