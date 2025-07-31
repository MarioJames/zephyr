"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Popover, List, Spin, App } from "antd";
import { Input } from "@lobehub/ui";
import { SearchOutlined, DownOutlined } from "@ant-design/icons";
import { useEmployeeStore } from "@/store/employee";
import { sessionsAPI } from "@/services";
import { UserItem } from "@/services/user";
import { useCustomerAssigneeStyles } from "./styles";
import { CustomerAssigneeProps, EmployeeListItemProps } from "./types";
import { useDebounceFn } from "ahooks";

// 员工列表项组件
const EmployeeListItem: React.FC<EmployeeListItemProps> = ({
  employee,
  onClick,
}) => {
  const { styles } = useCustomerAssigneeStyles();

  const employeeName = employee.fullName || employee.username || "未知员工";
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
  title = "对接人",
  placeholder = "未分配",
  popoverPlacement = "bottom",
  disabled = false,
  onAssignSuccess,
  onAssignError,
  className,
  style,
  isTitle = false,
}) => {
  const { styles } = useCustomerAssigneeStyles();
  const { message } = App.useApp();

  // 组件状态
  const [searchText, setSearchText] = useState("");
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  // 从session对象中提取数据
  const sessionId = session.id;
  const currentUserId = session.userId;

  const {
    loading: employeesLoading,
    searchEmployees,
    searchedEmployees,
  } = useEmployeeStore();

  const { run: debouncedSearchEmployees } = useDebounceFn(searchEmployees, {
    wait: 500,
  });

  // 进入页面发现没有搜索员工，则先搜索一次
  useEffect(() => {
    if (!searchedEmployees.length) {
      searchEmployees("", 10);
    }
  }, []);

  // 处理员工选择
  const handleEmployeeSelect = useCallback(
    async (employee: UserItem) => {
      if (updating || disabled) return;

      setUpdating(true);

      try {
        await sessionsAPI.updateSession(sessionId, {
          userId: employee.id,
        });

        const employeeName =
          employee.fullName || employee.username || "未知员工";
        message.success(`已成功分配给 ${employeeName}`);

        setPopoverOpen(false);
        setSearchText("");
        onAssignSuccess?.(employee);
      } catch (error) {
        console.error("分配员工失败:", error);
        message.error("分配员工失败，请重试");
        onAssignError?.(error);
      } finally {
        setUpdating(false);
      }
    },
    [
      sessionId,
      currentUserId,
      updating,
      disabled,
      message,
      onAssignSuccess,
      onAssignError,
    ]
  );

  // 处理弹窗状态变化
  const handlePopoverOpenChange = useCallback(
    (open: boolean) => {
      if (disabled || updating) return;

      setPopoverOpen(open);
      if (!open) {
        setSearchText("");
      }
    },
    [disabled, updating]
  );

  // 渲染弹窗内容
  const popoverContent = (
    <div className={styles.popoverContent}>
      {/* 搜索框 */}
      <div className={styles.searchContainer}>
        <Input
          className={styles.searchInput}
          placeholder="搜索员工姓名、邮箱"
          prefix={<SearchOutlined />}
          onChange={(e) => debouncedSearchEmployees(e.target.value, 10)}
          autoFocus
        />
      </div>

      {/* 员工列表 */}
      {employeesLoading ? (
        <div className={styles.loadingState}>
          <Spin size="small" />
          <div style={{ marginTop: 8 }}>加载中...</div>
        </div>
      ) : searchedEmployees.length > 0 ? (
        <List
          className={styles.employeeList}
          size="small"
          dataSource={searchedEmployees}
          renderItem={(employee) => (
            <List.Item key={employee.id}>
              <EmployeeListItem
                employee={employee}
                onClick={handleEmployeeSelect}
              />
            </List.Item>
          )}
        />
      ) : (
        <div className={styles.emptyState}>
          {searchText ? "暂无匹配的员工" : "暂无员工数据"}
        </div>
      )}
    </div>
  );

  // 获取显示文本
  const displayText = session.user
    ? session.user.fullName || session.user.username || "未知员工"
    : placeholder;

  return (
    <div
      className={`${styles.assigneeContainer} ${className || ""}`}
      style={style}
    >
      {title && <div className={styles.assigneeTitle}>{title}</div>}

      <Popover
        destroyOnHidden
        content={popoverContent}
        title="选择对接人"
        trigger="click"
        placement={popoverPlacement}
        open={popoverOpen}
        onOpenChange={handlePopoverOpenChange}
      >
        <div
          className={`${styles.assigneeValue} ${disabled ? "disabled" : ""}`}
        >
          {updating ? (
            <>
              <Spin size="small" style={{ marginRight: 8 }} />
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
