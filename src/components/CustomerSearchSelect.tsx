'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Select, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { createStyles } from 'antd-style';

interface Customer {
  sessionId: string;
  name: string;
  company?: string;
  phone?: string;
  email?: string;
  wechat?: string;
  type: string;
}

interface CustomerSearchSelectProps {
  customers: Customer[];
  loading?: boolean;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  onSelect?: (customerId: string) => void;
}

const useStyles = createStyles(({ css }) => ({
  searchSelect: css`
    .ant-select-dropdown {
      max-height: 400px;
    }
    
    .ant-select-item-option-content {
      padding: 8px 0;
    }
  `,
}));

export const CustomerSearchSelect: React.FC<CustomerSearchSelectProps> = ({
  customers,
  loading = false,
  placeholder = '搜索客户',
  className,
  style,
  onSelect
}) => {
  const { styles } = useStyles();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  // 防抖搜索
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setSearchLoading(false);
    }, 300);

    if (searchQuery) {
      setSearchLoading(true);
    }

    return () => {
      clearTimeout(timer);
      if (!searchQuery) {
        setSearchLoading(false);
      }
    };
  }, [searchQuery]);

  // 过滤客户数据
  const filteredCustomers = useMemo(() => {
    if (!debouncedSearchQuery || debouncedSearchQuery.length < 2) {
      return [];
    }
    
    const query = debouncedSearchQuery.toLowerCase();
    return customers
      .filter((customer) => {
        return (
          customer.name.toLowerCase().includes(query) ||
          (customer.company || '').toLowerCase().includes(query) ||
          (customer.phone || '').toLowerCase().includes(query) ||
          (customer.email || '').toLowerCase().includes(query) ||
          (customer.wechat || '').toLowerCase().includes(query)
        );
      })
      .slice(0, 10); // 限制显示数量提高性能
  }, [customers, debouncedSearchQuery]);

  const handleSelect = (value: string) => {
    if (onSelect) {
      onSelect(value);
    } else {
      // 默认跳转到客户详情页
      router.push(`/customer/detail?id=${value}`);
    }
    setSearchQuery(''); // 清空搜索
  };

  return (
    <Select
      showSearch
      placeholder={placeholder}
      suffixIcon={<SearchOutlined />}
      className={`${styles.searchSelect} ${className || ''}`}
      style={style}
      value={searchQuery || undefined}
      onSearch={setSearchQuery}
      onChange={handleSelect}
      onClear={() => setSearchQuery('')}
      allowClear
      filterOption={false}
      notFoundContent={
        searchLoading || loading ? (
          <Spin size="small" />
        ) : debouncedSearchQuery ? (
          '暂无匹配的客户'
        ) : (
          '请输入关键词搜索客户'
        )
      }
    >
      {filteredCustomers.map((customer) => (
        <Select.Option 
          key={customer.sessionId} 
          value={customer.sessionId}
          label={customer.name}
        >
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            padding: '4px 0'
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ 
                fontWeight: '500', 
                fontSize: '14px',
                marginBottom: '2px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {customer.name}
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: '#666',
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                overflow: 'hidden'
              }}>
                {customer.company && (
                  <span style={{ 
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '120px'
                  }}>
                    📊 {customer.company}
                  </span>
                )}
                {customer.phone && (
                  <span style={{ color: '#999' }}>
                    📞 {customer.phone}
                  </span>
                )}
              </div>
            </div>
            <div style={{ 
              fontSize: '11px', 
              color: '#999',
              textAlign: 'right',
              minWidth: '40px'
            }}>
              {customer.type}
            </div>
          </div>
        </Select.Option>
      ))}
    </Select>
  );
};

export default CustomerSearchSelect;