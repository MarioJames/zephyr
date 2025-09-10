"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Select, Avatar, Input, Skeleton } from "antd";
import { UserOutlined, SearchOutlined } from "@ant-design/icons";
import { createStyles } from "antd-style";
import { ChevronDown } from "lucide-react";

import userService, { UserItem } from "@/services/user";

const { Option } = Select;

const useStyles = createStyles(({ css, token }) => ({
  selector: css`
    width: 100%;
    height: 32px;

    .ant-select-arrow {
      margin-top: -8px;
    }

    .ant-select-selector {
      height: 32px !important;
      border-radius: 6px;
      border: 1px solid ${token.colorBorder};
      background: ${token.colorBgContainer};
      display: flex;
      align-items: center;
      transition: background 0.2s, color 0.2s, border-color 0.2s;

      .ant-select-selection-item {
        display: flex;
        align-items: center;
        height: 30px;
        line-height: 30px;
        color: ${token.colorText};
        padding: 0;
      }

      .ant-select-selection-placeholder {
        display: flex;
        align-items: center;
        height: 30px;
        line-height: 30px;
        color: ${token.colorText};
        padding: 0;
      }
    }

    .ant-select-arrow {
      color: ${token.colorText};
      flex-shrink: 0;
      width: 16px;
      height: 16px;
    }

    &.ant-select-focused .ant-select-selector {
      border-color: ${token.colorPrimary};
      box-shadow: 0 0 0 2px ${token.colorPrimary}20;
    }

    &:hover .ant-select-selector {
      border-color: ${token.colorPrimary};
    }
  `,

  dropdownContainer: css`
    .ant-select-dropdown {
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      width: 250px;

      .ant-select-item {
        padding: 8px 12px;

        &:hover {
          background-color: ${token.colorBgTextHover};
        }

        &.ant-select-item-option-selected {
          background-color: ${token.colorPrimary}20;
          color: ${token.colorPrimary};
        }
      }
    }

    /* 自定义选中样式 - 使用更高优先级 */
    .ant-select-item.selected-option {
      background-color: rgba(0, 0, 0, 0.05) !important;
      
      .user-name {
        font-weight: 600 !important;
      }
    }
  `,

  searchInput: css`
    margin-bottom: 12px;

    .ant-input {
      border-radius: 6px;
    }
  `,

  userOption: css`
    display: flex;
    align-items: center;
    gap: 8px;

    .user-info {
      display: flex;
      flex-direction: column;
      min-width: 0;

      .user-name {
        font-weight: 500;
        color: ${token.colorText};
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .user-email {
        font-size: 12px;
        color: ${token.colorTextSecondary};
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  `,

  selectedUser: css`
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    min-width: 0;

    .ant-avatar {
      flex-shrink: 0 0 20px;
      width: 20px !important;
      height: 20px !important;
    }

    span {
      font-weight: 500;
      color: ${token.colorText};
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 1;
      min-width: 0;
    }
  `,
}));

interface EmployeeSelectorProps {
  onChange?: (userId: string, user: UserItem) => void;
  onClear?: () => void; // 取消选择的回调
  value?: string; // 当前选中的用户ID
  selectedLabel?: string; // 当前选中用户的显示名称（用于避免闪烁）
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const EmployeeSelector: React.FC<EmployeeSelectorProps> = ({
  onChange,
  onClear,
  value,
  selectedLabel,
  placeholder = "选择员工",
  disabled = false,
  className,
}) => {
  const { styles } = useStyles();
  const [employees, setEmployees] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 获取员工列表
  const fetchEmployees = async (keyword?: string) => {
    setLoading(true);
    try {
      if (keyword) {
        const searchResults = await userService.searchUsers(keyword, 20);
        const filtered = (searchResults || []).filter((u) => u.id !== 'unassigned');
        setEmployees(filtered);
      } else {
        const allUsers = await userService.getAllUsers({ pageSize: 20 });
        const filtered = (allUsers || []).filter((u) => u.id !== 'unassigned');
        setEmployees(filtered);
      }
    } catch (error) {
      console.error("获取员工列表失败:", error);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载员工列表
  useEffect(() => {
    fetchEmployees();
  }, []);

  // 在外部 value 变化时，确保下拉选项中存在该用户，避免短暂显示 userId
  useEffect(() => {
    const ensureSelectedUserOption = async () => {
      if (!value) return;
      // 如果当前员工列表中已包含该用户，则无需处理
      const exists = employees.some((u) => u.id === value);
      if (exists) return;
      try {
        const user = await userService.getUserById(value);
        if (user) {
          setEmployees((prev) => {
            // 避免重复插入
            if (prev.some((u) => u.id === user.id)) return prev;
            return [user, ...prev];
          });
        }
      } catch {
        // 忽略错误，fallback 仍会显示占位符
      }
    };

    ensureSelectedUserOption();
  }, [value, employees]);

  // 搜索防抖
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isDropdownOpen && searchKeyword.trim() !== '') {
        fetchEmployees(searchKeyword);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchKeyword, isDropdownOpen]);

  // 过滤后的员工列表，并处理选中项置顶
  const filteredEmployees = useMemo(() => {
    let filtered = employees;
    
    // 如果有搜索关键字，先进行过滤
    if (searchKeyword) {
      filtered = employees.filter(
        (user) =>
          user.fullName?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          user.username?.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }
    
    // 若当前选中的用户不在列表中，但提供了 selectedLabel，则临时插入一个选项，避免显示 userId
    if (value && !filtered.some((u) => u.id === value) && selectedLabel) {
      const syntheticUser: UserItem = { id: value, fullName: selectedLabel } as UserItem;
      filtered = [syntheticUser, ...filtered];
    }
    
    // 如果有选中的用户且在过滤结果中，将其置顶
    if (value) {
      const selectedUser = filtered.find(user => user.id === value);
      if (selectedUser) {
        const othersUsers = filtered.filter(user => user.id !== value);
        return [selectedUser, ...othersUsers];
      }
    }
    
    return filtered;
  }, [employees, searchKeyword, value, selectedLabel]);

  // 当尚未拿到 label（既不在 employees 列表也没有 selectedLabel）时，不设置 value，避免短暂显示 userId
  const displayValue = useMemo(() => {
    if (!value) return undefined;
    const exists = filteredEmployees.some((u) => u.id === value);
    if (exists || selectedLabel) return value;
    return undefined;
  }, [value, filteredEmployees, selectedLabel]);

  const handleSelect = (userId: string) => {
    // 如果点击的是已选中的用户，则取消选择
    if (value === userId && onClear) {
      onClear();
      setIsDropdownOpen(false);
      return;
    }

    const user = employees.find((emp) => emp.id === userId);
    if (user && onChange) {
      onChange(userId, user);
    }
    setIsDropdownOpen(false);
  };

  const handleDropdownVisibleChange = (open: boolean) => {
    setIsDropdownOpen(open);
    if (open && employees.length === 0) {
      fetchEmployees();
    }
  };

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
  };

  return (
    <Select
      className={`${styles.selector} ${className || ""}`}
      disabled={disabled}
      filterOption={false}
      labelInValue={false}
      loading={loading}
      onOpenChange={handleDropdownVisibleChange}
      onSelect={handleSelect}
      optionLabelProp="label"
      placeholder={placeholder}
      popupRender={(menu) => (
        <div className={styles.dropdownContainer}>
          <Input
            className={styles.searchInput}
            onChange={(e) => handleSearch(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            placeholder="搜索员工"
            prefix={<SearchOutlined />}
            value={searchKeyword}
          />
          {menu}
        </div>
      )}
      showSearch={false}
      styles={{
        popup: {
          root: {
            minWidth: 280,
            padding: 12,
          },
        },
      }}
      suffixIcon={<ChevronDown size={16} />}
      value={displayValue}
    >
      {loading ? (
        Array.from({ length: 3 }).map((_, index) => (
          <Option disabled key={`loading-${index}`} value={`loading-${index}`}>
            <div className={styles.userOption}>
              <Skeleton.Avatar active size="small" style={{ width: 40, height: 40, borderRadius: '50%' }} />
              <div className="user-info" style={{ flex: 1 }}>
                <Skeleton.Input active size="small" style={{ width: '100%', height: 20 }} />
                <Skeleton.Input active size="small" style={{ width: '60%', marginTop: 4, height: 16 }} />
              </div>
            </div>
          </Option>
        ))
      ) : (
        filteredEmployees.map((user) => {
          const isSelected = value === user.id;
          
          return (
            <Option
              key={user.id}
              label={user.fullName || user.username || "未知用户"}
              value={user.id}
              className={isSelected ? 'selected-option' : ''}
            >
              <div className={styles.userOption}>
                <Avatar icon={<UserOutlined />} size={24} src={user.avatar} />
                <div className="user-info">
                  <div className="user-name">
                    {user.fullName || user.username || "未知用户"}
                    {isSelected && <span style={{ color: '#1890ff', fontSize: '12px', marginLeft: '8px' }}>(当前选中)</span>}
                  </div>
                  {user.email && <div className="user-email">{user.email}</div>}
                </div>
              </div>
            </Option>
          );
        })
      )}
    </Select>
  );
};

export default EmployeeSelector;
