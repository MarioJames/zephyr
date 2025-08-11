"use client";
import React, { useState } from "react";
import {
  Table,
  Typography,
  Space,
  Dropdown,
  Form,
  App,
  Popconfirm,
} from "antd";
import { Button, Input } from "@lobehub/ui";
import { SearchOutlined } from "@ant-design/icons";
import { createStyles } from "antd-style";
import type { ColumnsType } from "antd/es/table";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { useEmployeeStore } from "@/store/employee";
import { useGlobalStore } from "@/store/global";
import { globalSelectors } from "@/store/global/selectors";
import { UserItem } from "@/services/user";
import { mailAPI, casdoorAPI } from "@/services";
import { CircleCheck, SquarePen, ChevronDown } from "lucide-react";
import EmployeeCustomerModal from "./components/EmployeeCustomerModal";
import EmployeeEditModal from "./components/EmployeeEditModal";
import SendLoginGuideModal from "./components/SendLoginGuideModal";
import NoAuthority from "@/components/NoAuthority";

import { useRoleStore } from "@/store/role";

const { Title } = Typography;

const useStyles = createStyles(({ css, token }) => ({
  container: css`
    padding: 16px 24px;
    height: 100%;
    display: flex;
    flex-direction: column;
    width: 100%;
    box-sizing: border-box;
    overflow: scroll;
  `,
  header: css`
    height: 56px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  `,
  title: css`
    margin: 0;
  `,
  headerRight: css`
    display: flex;
    align-items: center;
    gap: 16px;
  `,
  tableContainer: css`
    flex: 1;
  `,
  roleItem: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
  `,
  roleDropdown: css`
    width: 154px;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
    z-index: 1050;
    padding: 8px !important;
    & .ant-dropdown-menu-item {
      height: 36px;
      line-height: 36px;
      padding: 0 16px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    & .ant-dropdown-menu-item:hover {
      background: #f5f5f5 !important;
    }
  `,
  loginGuideCard: css`
    padding: 16px;
    width: 360px;
  `,
  cardActions: css`
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 16px;
  `,
  cancelButton: css`
    border: 1px solid rgba(0, 0, 0, 0.15);
  `,
  operationButton: css`
    padding: 0;
    margin: 0 4px;
  `,
  addEmployeeModal: css`
    .ant-modal-content {
      border-radius: 8px;
      background: ${token.colorBgContainer};
      padding: 24px;
    }
  `,
  modalTitle: css`
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 24px;
  `,
  sectionTitle: css`
    font-size: 16px;
    font-weight: 500;
    margin: 16px 0 8px 0;
  `,
  avatarUploader: css`
    display: flex;
    align-items: center;
    margin-bottom: 16px;
  `,
  avatarCircle: css`
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: ${token.colorBgContainer};
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
    }
  `,
  uploadText: css`
    display: flex;
    align-items: center;
    color: ${token.colorPrimary};
    cursor: pointer;
    .anticon {
      margin-right: 8px;
    }
  `,
  formContainer: css`
    background-color: ${token.colorPrimary};
    padding: 16px;
    border-radius: 8px;
  `,
  formItem: css`
    margin-bottom: 16px;

    .ant-form-item-label {
      padding-bottom: 4px;
    }
  `,
  modalFooter: css`
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
  `,
  blackText: css`
    color: ${token.colorPrimary} !important;
  `,
  customInput: css`
    border-radius: 6px !important;
    background: ${token.colorBgContainer} !important;
    height: 32px !important;
    border: none !important;
    box-shadow: none !important;
  `,
}));

export default function EmployeePage() {
  const { message } = App.useApp();
  const { styles, theme } = useStyles();
  const isAdmin = useGlobalStore(globalSelectors.isCurrentUserAdmin);

  // 使用store
  const {
    employees,
    loading,
    fetchEmployees,
    updateEmployee,
    deleteEmployee,
    uploadAvatar,
    fetchSessionList,
    updateEmployeeSessions,
    searchEmployees,
    updateEmployeeRole,
    searchedEmployees,
    searchQuery,
    clearSearch,
  } = useEmployeeStore();

  const { roles } = useRoleStore();

  // 分页状态
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  // 页面状态
  const [searchValue, setSearchValue] = useState("");
  const [loginGuideVisible, setLoginGuideVisible] = useState(false);
  const [loginGuideLoading, setLoginGuideLoading] = useState(false);
  const [employeeModalVisible, setEmployeeModalVisible] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<UserItem | null>(null);
  const [avatarFile, setAvatarFile] = useState<UploadFile | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [form] = Form.useForm();
  const [customerModalVisible, setCustomerModalVisible] = useState(false);
  const [customerTab, setCustomerTab] = useState("all");
  const [selectedLeft, setSelectedLeft] = useState<string[]>([]);
  const [selectedRight, setSelectedRight] = useState<string[]>([]);

  const [employeeCustomers, setEmployeeCustomers] = useState<string[]>([]);
  const [currentCustomerEmployee, setCurrentCustomerEmployee] =
    useState<UserItem | null>(null);
  const [sessionList, setSessionList] = useState<any[]>([]);
  const [sessionLoading, setSessionLoading] = useState(false);

  const displayEmployees = searchQuery ? searchedEmployees : employees;

  // 页面初始化加载员工和角色
  React.useEffect(() => {
    fetchEmployees({ page: pagination.current, pageSize: pagination.pageSize });
  }, [pagination.current, pagination.pageSize]);

  // 处理角色变更
  const handleRoleChange = async (employeeId: string, newRoleId: string) => {
    const employee = employees.find((emp) => emp.id === employeeId);
    if (!employee) return;
    try {
      await updateEmployeeRole(employeeId, {
        addRoles: [{ roleId: Number(newRoleId) }],
      });
      message.success("修改成功");

      fetchEmployees({
        page: pagination.current,
        pageSize: pagination.pageSize,
      });
    } catch (e: any) {
      message.error(e.message || "修改失败");
    }
  };

  // 处理发送登录引导
  const handleSendLoginGuide = (employee: UserItem) => {
    setCurrentEmployee(employee);
    setLoginGuideVisible(true);
  };

  // 确认发送登录引导邮件
  const handleConfirmSendLoginGuide = async () => {
    if (!currentEmployee) {
      message.error("员工信息不存在");
      return;
    }

    if (!currentEmployee.email) {
      message.error("员工邮箱不存在，无法发送登录引导");
      return;
    }

    setLoginGuideLoading(true);
    try {
      await mailAPI.sendLoginGuideMail(
        currentEmployee.id,
        currentEmployee.email,
        currentEmployee.username || currentEmployee.fullName || "员工"
      );

      message.success("登录引导邮件发送成功");

      setLoginGuideVisible(false);
    } catch (error: any) {
      console.error("发送登录引导邮件失败:", error);
      message.error(error.message || "登录引导邮件发送失败");
    } finally {
      setLoginGuideLoading(false);
    }
  };

  // 处理编辑员工
  const handleEdit = (employeeId: string) => {
    const employee = employees.find((emp) => emp.id === employeeId);
    if (employee) {
      setIsEditMode(true);
      setCurrentEmployee(employee);
      form.setFieldsValue({
        username: employee.username,
        email: employee.email,
        phone: employee.phone,
        fullName: employee.fullName,
        roleId: employee.roles?.[0]?.id,
      });
      setAvatarFile(
        employee.avatar
          ? {
              uid: "-1",
              name: "avatar.png",
              status: "done",
              url: employee.avatar,
            }
          : null
      );
      setEmployeeModalVisible(true);
    }
  };

  // 处理删除员工
  const handleDelete = async (employeeId: string) => {
    try {
      // 获取员工信息用于删除 Casdoor 用户
      const employee = employees.find((emp) => emp.id === employeeId);
      
      // 先删除本地员工记录
      await deleteEmployee(employeeId);

      // 然后删除 Casdoor 用户
      if (employee?.username) {
        try {
          await casdoorAPI.deleteUser(employee.username);
          message.success("删除成功");
        } catch (casdoorError: any) {
          console.error("Casdoor 用户删除失败:", casdoorError);
          message.warning("员工删除成功，但 Casdoor 用户删除失败");
        }
      } else {
        message.success("删除成功");
      }
    } catch (e: any) {
      message.error(e.message || "删除失败");
    }
  };

  // 处理添加员工弹窗显示
  const showAddEmployeeModal = () => {
    setIsEditMode(false);
    setCurrentEmployee(null);
    form.resetFields();
    setAvatarFile(null);
    setEmployeeModalVisible(true);
  };

  // 处理员工弹窗关闭
  const handleEmployeeModalCancel = () => {
    setSubmitLoading(false);
    form.resetFields();
    setAvatarFile(null);
    setEmployeeModalVisible(false);
    setCurrentEmployee(null);
    setIsEditMode(false);
  };

  // 处理员工表单提交
  const handleEmployeeSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitLoading(true);

      if (isEditMode && currentEmployee) {
        // 编辑员工
        await updateEmployee(currentEmployee.id, {
          ...values,
          ...(avatarFile?.url && { avatar: avatarFile?.url }),
        });

        // 更新 Casdoor 用户信息
        if (currentEmployee.username) {
          try {
            await casdoorAPI.updateUser(currentEmployee.username, {
              displayName: values.username,
              email: values.email,
              phone: values.phone,
              avatar: avatarFile?.url || '',
            });
          } catch (casdoorError: any) {
            console.error("Casdoor 用户更新失败:", casdoorError);
            message.warning("员工信息更新成功，但 Casdoor 用户更新失败");
          }
        }

        fetchEmployees();
        handleEmployeeModalCancel();
        message.success("修改员工成功");
      } else {
        // 创建员工
        // 先在 Casdoor 中创建用户
        await casdoorAPI.createUser({
          name: values.username,
          displayName: values.username,
          email: values.email,
          phone: values.phone,
          avatar: avatarFile?.url || '',
        });

        // 使用用户名作为 ID 创建本地员工记录
        const employeeId = values.username;
        
        await updateEmployee(employeeId, {
          ...values,
          username: values.username,
          avatar: avatarFile?.url,
        });
        
        // 创建员工时，添加默认员工角色
        await updateEmployeeRole(employeeId, {
          addRoles: [{ roleId: 7 }],
        });

        fetchEmployees();
        handleEmployeeModalCancel();
        message.success("添加员工成功");
      }
    } catch (error: any) {
      console.error("员工操作失败:", error);
      setSubmitLoading(false);

      // 统一错误处理
      if (isEditMode) {
        message.error(error.message || "修改员工失败");
      } else {
        message.error(error.message || "添加员工失败");
      }
    }
  };

  // 头像上传前处理
  const beforeUpload = async (file: File) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("只能上传 JPG/PNG 格式的图片!");
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("图片大小不能超过 2MB!");
      return false;
    }
    try {
      setAvatarUploading(true);
      const url = await uploadAvatar(file);
      setAvatarFile({
        uid: `${Date.now()}_${file.name}`,
        name: file.name,
        status: "done",
        url,
      });
      message.success("头像上传成功");
    } catch (e: any) {
      message.error(e.message || "头像上传失败");
    } finally {
      setAvatarUploading(false);
    }
    // 阻止Upload组件自动上传
    return false;
  };

  // 头像上传变更处理
  const handleAvatarChange: UploadProps["onChange"] = ({ fileList }) => {
    if (fileList.length === 0) {
      setAvatarFile(null);
    }
  };

  // 关闭客户管理弹窗时清空相关状态
  const handleCustomerModalClose = () => {
    setCustomerModalVisible(false);
    setSessionList([]);
    setEmployeeCustomers([]);
    setSelectedLeft([]);
    setSelectedRight([]);
    setCurrentCustomerEmployee(null);
  };

  const onSaveRelation = async () => {
    if (!currentCustomerEmployee) return;
    setSessionLoading(true);
    try {
      await updateEmployeeSessions(
        currentCustomerEmployee.id,
        employeeCustomers
      );
      message.success("保存成功");
      handleCustomerModalClose();
    } catch (e: any) {
      message.error(e.message || "保存失败");
    } finally {
      setSessionLoading(false);
    }
  };

  // 打开客户管理弹窗
  const handleCustomerManage = async (employee: UserItem) => {
    setCurrentCustomerEmployee(employee);
    setCustomerModalVisible(true);
    setSelectedLeft([]);
    setSelectedRight([]);
    setSessionLoading(true);
    try {
      const list = await fetchSessionList();
      setSessionList(list);
      setEmployeeCustomers((employee.sessions || []).map((s) => s.id));
    } finally {
      setSessionLoading(false);
    }
  };

  // 穿梭到右侧
  const moveToRight = () => {
    setEmployeeCustomers([...employeeCustomers, ...selectedLeft]);
    setSelectedLeft([]);
  };

  // 穿梭到左侧
  const moveToLeft = () => {
    setEmployeeCustomers(
      employeeCustomers.filter((id) => !selectedRight.includes(id))
    );
    setSelectedRight([]);
  };
  // 左侧客户列表过滤
  const leftList = sessionList.filter((c) => {
    if (customerTab === "all") return !employeeCustomers.includes(c.id);
    if (customerTab === "unassigned") {
      return !c.userId;
    }

    return false;
  });
  // 右侧客户列表
  const rightList = sessionList.filter((c) => employeeCustomers.includes(c.id));
  const columns: ColumnsType<UserItem> = [
    {
      title: "员工姓名",
      dataIndex: "username",
      key: "username",
      render: (text) => text || "-",
    },
    {
      title: "登录邮箱",
      dataIndex: "email",
      key: "email",
      render: (text) => text || "-",
    },
    {
      title: "联系电话",
      dataIndex: "phone",
      key: "phone",
      render: (text) => text || "-",
    },
    {
      title: "账户ID",
      dataIndex: "id",
      key: "id",
      render: (text) => text || "-",
    },
    {
      title: "客户数量",
      dataIndex: "customerCount",
      key: "customerCount",
      render: (_: any, record: UserItem) => {
        const customerList = record.sessions || [];
        const count = customerList?.length > 0 ? customerList?.length - 1 : 0;

        return (
          <span
            style={{
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            {count === undefined || count === null ? (
              "-"
            ) : (
              <>
                {count}
                <SquarePen
                  onClick={() => handleCustomerManage(record)}
                  size={16}
                  style={{ marginLeft: 10 }}
                />
              </>
            )}
          </span>
        );
      },
    },
    {
      title: "员工角色",
      dataIndex: "roles",
      key: "roles",
      render: (_: any, record: UserItem) => {
        const currentRole = record.roles?.[0];

        const displayRole = roles.find(
          (r) => r.id === currentRole?.id
        )?.displayName;

        const roleMenuItems = roles?.map((role) => ({
          key: role.id,
          label: (
            <div className={styles.roleItem}>
              <span>{role.displayName}</span>
              {role.id === currentRole?.id && <CircleCheck size={16} />}
            </div>
          ),
        }));

        return (
          <Dropdown
            menu={{
              items: roleMenuItems,
              onClick: ({ key }) => handleRoleChange(record.id, key),
              className: styles.roleDropdown,
            }}
            trigger={["click"]}
          >
            <a className={styles.blackText} onClick={(e) => e.preventDefault()}>
              {displayRole || "暂无角色"} <ChevronDown size={16} />
            </a>
          </Dropdown>
        );
      },
    },
    {
      title: "员工消息记录",
      dataIndex: "messageCount",
      key: "messageCount",
      render: (text: number) => {
        if (text === undefined || text === null) {
          return "-";
        }
        return <span className={styles.blackText}>{text}</span>;
      },
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            className={`${styles.operationButton} ${styles.blackText}`}
            onClick={() => handleSendLoginGuide(record)}
            type="link"
          >
            发送登录引导
          </Button>
          <Button
            className={`${styles.operationButton} ${styles.blackText}`}
            onClick={() => handleEdit(record.id)}
            type="link"
          >
            编辑
          </Button>
          <Popconfirm
            cancelText="取消"
            description="确定要删除该员工吗？此操作不可撤销。"
            okText="确认"
            onConfirm={() => handleDelete(record.id)}
            title="确认删除"
          >
            <Button
              className={`${styles.operationButton} ${styles.blackText}`}
              type="link"
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    // 如果搜索框为空，清空搜索状态，显示所有员工
    if (!value.trim()) {
      clearSearch();
    }
  };

  const handleSearch = () => {
    // Reset pagination to first page when searching
    setPagination((prev) => ({ ...prev, current: 1 }));
    searchEmployees(searchValue, pagination.pageSize);
  };

  const handleTableChange = (paginationConfig: any) => {
    setPagination({
      current: paginationConfig.current,
      pageSize: paginationConfig.pageSize,
    });
    // Use search API if there's a search value, otherwise use regular fetch
    if (searchValue) {
      searchEmployees(searchValue, paginationConfig.pageSize);
    } else {
      fetchEmployees({
        page: paginationConfig.current,
        pageSize: paginationConfig.pageSize,
      });
    }
  };

  // If not admin, show NoAuthority component
  if (!isAdmin) {
    return <NoAuthority />;
  }

  return (
    <div className={styles.container}>
      {/* 顶部标题和搜索区 */}
      <div className={styles.header}>
        <Title className={styles.title} level={4}>
          员工管理
        </Title>
        <div className={styles.headerRight}>
          <Input
            onChange={handleSearchChange}
            onPressEnter={handleSearch}
            placeholder="搜索员工"
            prefix={<SearchOutlined />}
            style={{ width: 240 }}
            value={searchValue}
          />
          <Button onClick={showAddEmployeeModal} type="primary">
            添加员工
          </Button>
        </div>
      </div>

      {/* 员工表格 */}
      <div className={styles.tableContainer}>
        <Table
          columns={columns}
          dataSource={displayEmployees}
          loading={loading}
          onChange={handleTableChange}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            showSizeChanger: true,
            showQuickJumper: false,
          }}
          rowKey="id"
        />
      </div>

      {/* 登录引导弹窗 */}
      <SendLoginGuideModal
        employee={currentEmployee}
        loading={loginGuideLoading}
        onCancel={() => {
          setLoginGuideVisible(false);
          setLoginGuideLoading(false);
        }}
        onSend={handleConfirmSendLoginGuide}
        open={loginGuideVisible}
        theme={theme}
      />

      {/* 员工弹窗（新增/编辑） */}
      <EmployeeEditModal
        avatarFile={avatarFile}
        avatarUploading={avatarUploading}
        beforeUpload={beforeUpload}
        form={form}
        isEditMode={isEditMode}
        loading={submitLoading}
        onAvatarChange={handleAvatarChange}
        onCancel={handleEmployeeModalCancel}
        onSubmit={handleEmployeeSubmit}
        open={employeeModalVisible}
      />

      {/* 员工对接客户管理弹窗 */}
      <EmployeeCustomerModal
        customerTab={customerTab}
        employee={currentCustomerEmployee}
        employeeCustomers={employeeCustomers}
        leftList={leftList}
        loading={sessionLoading}
        moveToLeft={moveToLeft}
        moveToRight={moveToRight}
        onClose={handleCustomerModalClose}
        onSave={onSaveRelation}
        open={customerModalVisible}
        rightList={rightList}
        selectedLeft={selectedLeft}
        selectedRight={selectedRight}
        sessionList={sessionList}
        setCustomerTab={setCustomerTab}
        setSelectedLeft={setSelectedLeft}
        setSelectedRight={setSelectedRight}
      />
    </div>
  );
}
