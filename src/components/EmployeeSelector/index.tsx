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
  selectedUser?: UserItem; // 当前选中的用户信息
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const EmployeeSelector: React.FC<EmployeeSelectorProps> = ({
  onChange,
  onClear,
  value,
  selectedUser,
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
        setEmployees(searchResults);
      } else {
        const allUsers = await userService.getAllUsers({ pageSize: 20 });
        setEmployees(allUsers);
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

  // 搜索防抖
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isDropdownOpen && searchKeyword.trim() !== '') {
        fetchEmployees(searchKeyword);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchKeyword, isDropdownOpen]);

  // 过滤后的员工列表
  const filteredEmployees = useMemo(() => {
    if (!searchKeyword) return employees;
    return employees.filter(
      (user) =>
        user.fullName?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  }, [employees, searchKeyword]);

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
      value={selectedUser ? (selectedUser.fullName || selectedUser.username || "未知用户") : undefined}
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
