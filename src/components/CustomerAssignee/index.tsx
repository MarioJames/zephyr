'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Popover, List, Spin, App } from 'antd';
import { Input } from '@lobehub/ui';
import { SearchOutlined, DownOutlined } from '@ant-design/icons';
import { useEmployeeStore } from '@/store/employee';
import { sessionsAPI } from '@/services';
import { UserItem } from '@/services/user';
import { useCustomerAssigneeStyles } from './styles';
import { CustomerAssigneeProps, EmployeeListItemProps } from './types';
import { useDebounceFn } from 'ahooks';
import { useSessionStore } from '@/store/session';
// 员工列表项组件
const EmployeeListItem: React.FC<EmployeeListItemProps> = ({
  employee,
  onClick,
}) => {
  const { styles } = useCustomerAssigneeStyles();

  const employeeName = employee.fullName || employee.username || '未知员工';
  const employeeEmail = employee.email;

  return (
    <div className={styles.employeeItem} onClick={() => onClick(employee)}>
      <div className={styles.employeeName}>{employeeName}</div>
      {employeeEmail && (
        <div className={styles.employeeInfo}>{employeeEmail}</div>
      )}
    </div>
  );
};

// 主组件
export const CustomerAssignee: React.FC<CustomerAssigneeProps> = ({
  session,
  title = '对接人',
  placeholder = '未分配',
  popoverPlacement = 'bottom',
  disabled = false,
  onAssignSuccess,
  className,
  style,
  isTitle = false,
}) => {
  const { styles } = useCustomerAssigneeStyles();
  const { message } = App.useApp();

  // 组件状态
  const [searchText, setSearchText] = useState('');
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  // 滚动容器引用
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 从session对象中提取数据
  const sessionId = session?.id;
  const currentUserId = session?.userId;

  const {
    loading: employeesLoading,
    loadingMore,
    hasMore,
    searchEmployees,
    loadMoreEmployees,
    searchedEmployees,
  } = useEmployeeStore();

  const { run: debouncedSearchEmployees } = useDebounceFn(
    (keyword: string) => {
      // 只有当关键词不为空时才搜索
      if (keyword.trim()) {
        searchEmployees(keyword.trim(), 10, true);
      }
      // 移除空搜索的逻辑，避免与初始搜索冲突
    },
    { wait: 500 }
  );

  // 进入页面发现没有搜索员工，则先搜索一次
  useEffect(() => {
    if (!searchedEmployees.length && !employeesLoading) {
      searchEmployees('', 10, true);
    }
  }, [searchedEmployees.length, employeesLoading]);

  // 处理滚动加载更多
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || loadingMore || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } =
      scrollContainerRef.current;
    const threshold = 50; // 距离底部50px时开始加载

    if (scrollTop + clientHeight >= scrollHeight - threshold) {
      loadMoreEmployees(searchText, 10);
    }
  }, [loadingMore, hasMore, searchText, loadMoreEmployees]);

  // 处理员工选择
  const handleEmployeeSelect = useCallback(
    async (employee: UserItem) => {
      if (updating || disabled) return;

      setUpdating(true);

      try {
        // 使用新的transferSession API来完整转移session及其相关数据
        const result = await sessionsAPI.transferSession(
          sessionId,
          employee.id
        );

        const employeeName =
          employee.fullName || employee.username || '未知员工';
        message.success(
          `已成功分配给 ${employeeName} (转移了 ${result?.updatedTopicsCount} 个话题和 ${result?.updatedMessagesCount} 条消息)`
        );
        // 标记session数据需要刷新
        useSessionStore.getState().setNeedsRefresh(true);
        setPopoverOpen(false);
        setSearchText('');
        onAssignSuccess?.(employee);
      } catch (error) {
        console.error('分配员工失败:', error);
        message.error('分配员工失败，请重试');
      } finally {
        setUpdating(false);
      }
    },
    [sessionId, currentUserId, updating, disabled, message, onAssignSuccess]
  );

  // 处理弹窗状态变化
  const handlePopoverOpenChange = useCallback(
    (open: boolean) => {
      if (disabled || updating) return;

      setPopoverOpen(open);
      if (!open) {
        setSearchText('');
      }
    },
    [disabled, updating]
  );

  // 处理搜索输入
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchText(value);
      debouncedSearchEmployees(value);
    },
    [debouncedSearchEmployees]
  );

  // 渲染弹窗内容
  const popoverContent = (
    <div className={styles.popoverContent}>
      {/* 搜索框 */}
      <div className={styles.searchContainer}>
        <Input
          autoFocus
          className={styles.searchInput}
          onChange={handleSearchChange}
          placeholder='搜索员工姓名、邮箱'
          prefix={<SearchOutlined />}
          value={searchText}
        />
      </div>

      {/* 员工列表 */}
      {employeesLoading ? (
        <div className={styles.loadingState}>
          <Spin size='small' />
          <div style={{ marginTop: 8 }}>加载中...</div>
        </div>
      ) : searchedEmployees.length > 0 ? (
        <div
          className={styles.employeeListContainer}
          onScroll={handleScroll}
          ref={scrollContainerRef}
        >
          <List
            className={styles.employeeList}
            dataSource={searchedEmployees}
            renderItem={(employee) => (
              <List.Item key={employee.id}>
                <EmployeeListItem
                  employee={employee}
                  onClick={handleEmployeeSelect}
                />
              </List.Item>
            )}
            size='small'
          />
          {/* 加载更多指示器 */}
          {loadingMore && (
            <div className={styles.loadingMore}>
              <Spin size='small' />
              <span style={{ marginLeft: 8 }}>加载更多...</span>
            </div>
          )}
          {/* 没有更多数据提示 */}
          {!hasMore && searchedEmployees.length > 0 && (
            <div className={styles.noMoreData}>没有更多数据了</div>
          )}
        </div>
      ) : (
        <div className={styles.emptyState}>
          {searchText ? '暂无匹配的员工' : '暂无员工数据'}
        </div>
      )}
    </div>
  );

  // 获取显示文本
  const displayText = session?.user
    ? session?.user?.fullName || session?.user?.username || '未知员工'
    : placeholder;

  return (
    <div
      className={`${styles.assigneeContainer} ${className || ''}`}
      style={style}
    >
      {title && <div className={styles.assigneeTitle}>{title}</div>}

      <Popover
        content={popoverContent}
        destroyOnHidden
        onOpenChange={handlePopoverOpenChange}
        open={popoverOpen}
        placement={popoverPlacement}
        title='选择对接人'
        trigger='click'
      >
        <div
          className={`${styles.assigneeValue} ${disabled ? 'disabled' : ''}`}
        >
          {updating ? (
            <>
              <Spin size='small' style={{ marginRight: 8 }} />
              更新中...
            </>
          ) : (
            <>
              <div className={isTitle ? styles.assigneeValueText : ''}>
                {displayText}
              </div>
              {!disabled && <DownOutlined className={styles.dropdownIcon} />}
            </>
          )}
        </div>
      </Popover>
    </div>
  );
};

export default CustomerAssignee;
