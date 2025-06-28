"use client";
import React, { useState } from "react";
import {
  Button,
  Input,
  Table,
  Typography,
  Space,
  Dropdown,
  Modal,
  Form,
  Upload,
  message,
  Tabs,
  Checkbox,
} from "antd";
import {
  SearchOutlined,
  UploadOutlined,
  PlusOutlined,
  DoubleRightOutlined,
  DoubleLeftOutlined,
} from "@ant-design/icons";
import { createStyles } from "antd-style";
import type { ColumnsType } from "antd/es/table";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { useEmployeeStore } from "@/store/employee";
import { employeeSelectors } from "@/store/employee/selectors";
import { UserItem } from "@/services/user";
import { adminList } from "@/const/role";
import { RoleItem } from "@/services/roles";
import { CircleCheck, SquarePen, ChevronDown } from "lucide-react";

const { Title, Text } = Typography;

// mock 客户数据
const allCustomers = [
  { id: "c1", name: "客户A", owner: "张三" },
  { id: "c2", name: "客户B", owner: "李四" },
  { id: "c3", name: "客户C", owner: "王五" },
  { id: "c4", name: "客户D", owner: "赵六" },
  { id: "c5", name: "客户E", owner: "钱七" },
  { id: "c6", name: "客户F", owner: "未分配" },
  { id: "c7", name: "客户G", owner: "未分配" },
];

// mock 员工消息数
const employeeMessageCount: Record<string, number> = {
  "1": 12,
  "2": 5,
  "3": 8,
  "4": 0,
  "5": 3,
  "6": 1,
  "7": 7,
  "8": 0,
};

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
  addButton: css`
    background-color: #000;
    color: #fff;
    &:hover,
    &:focus {
      background-color: #333;
      color: #fff;
    }
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
  confirmButton: css`
    background-color: #000;
    color: #fff;
    &:hover,
    &:focus {
      background-color: #333;
      color: #fff;
    }
  `,
  operationButton: css`
    padding: 0;
    margin: 0 4px;
  `,
  addEmployeeModal: css`
    .ant-modal-content {
      border-radius: 8px;
      background: #f4f4f4;
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
    background: #f0f0f0;
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
    background-color: #fff;
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
    color: #000 !important;
  `,
  customInput: css`
    border-radius: 6px !important;
    background: #eaeaea !important;
    height: 32px !important;
    border: none !important;
    box-shadow: none !important;
  `,
}));

export default function EmployeePage() {
  const { styles } = useStyles();
  // 使用store
  const {
    employees,
    roles,
    loading,
    error,
    fetchEmployees,
    fetchRoles,
    addEmployee,
    updateEmployee,
    deleteEmployee,
  } = useEmployeeStore();
  const searchEmployees = useEmployeeStore((s) => s.searchEmployees);

  // 分页状态
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  // 页面状态
  const [searchValue, setSearchValue] = useState("");
  const [loginGuideVisible, setLoginGuideVisible] = useState(false);
  const [employeeModalVisible, setEmployeeModalVisible] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<UserItem | null>(null);
  const [avatarFile, setAvatarFile] = useState<UploadFile | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [form] = Form.useForm();
  const [customerModalVisible, setCustomerModalVisible] = useState(false);
  const [customerTab, setCustomerTab] = useState("all");
  const [selectedLeft, setSelectedLeft] = useState<string[]>([]);
  const [selectedRight, setSelectedRight] = useState<string[]>([]);
  const [employeeCustomers, setEmployeeCustomers] = useState<string[]>([
    "c1",
    "c3",
  ]);
  const [currentCustomerEmployee, setCurrentCustomerEmployee] =
    useState<UserItem | null>(null);

  // 页面初始化加载员工和角色
  React.useEffect(() => {
    fetchEmployees({ page: pagination.current, pageSize: pagination.pageSize });
    fetchRoles();
  }, [pagination.current, pagination.pageSize]);

  // 处理角色变更
  const handleRoleChange = async (employeeId: string, newRoleId: string) => {
    const employee = employees.find((emp) => emp.id === employeeId);
    if (!employee) return;
    await updateEmployee(employeeId, { roleId: newRoleId });
  };

  // 处理发送登录引导
  const handleSendLoginGuide = (employee: UserItem) => {
    setCurrentEmployee(employee);
    setLoginGuideVisible(true);
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
    await deleteEmployee(employeeId);
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
      if (isEditMode && currentEmployee) {
        try {
          await updateEmployee(currentEmployee.id, {
            ...values,
            avatar: avatarFile?.url,
          });
          message.success('修改员工成功');
        } catch (e) {
          message.error('修改员工失败');
          return;
        }
      } else {
        try {
          await addEmployee({
            ...values,
            avatar: avatarFile?.url,
          });
          message.success('添加员工成功');
        } catch (e) {
          message.error('添加员工失败');
          return;
        }
      }
      handleEmployeeModalCancel();
    } catch (info) {
      // 表单校验失败
    }
  };

  // 头像上传前处理
  const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("只能上传 JPG/PNG 格式的图片!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("图片大小不能超过 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  // 头像上传变更处理
  const handleAvatarChange: UploadProps["onChange"] = ({ fileList }) => {
    if (fileList.length > 0) {
      setAvatarFile(fileList[0]);
    } else {
      setAvatarFile(null);
    }
  };

  // 打开客户管理弹窗
  const handleCustomerManage = (employee: UserItem) => {
    setCurrentCustomerEmployee(employee);
    setCustomerModalVisible(true);
    setSelectedLeft([]);
    setSelectedRight([]);
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
  const leftList = allCustomers.filter((c) => {
    if (customerTab === "all") return !employeeCustomers.includes(c.id);
    if (customerTab === "unassigned")
      return c.owner === "未分配" && !employeeCustomers.includes(c.id);
    return false;
  });
  // 右侧客户列表
  const rightList = allCustomers.filter((c) =>
    employeeCustomers.includes(c.id)
  );

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
        const count = customerList?.length;
        console.log("count", count, record);

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
                  size={16}
                  style={{ marginLeft: 10 }}
                  onClick={() => handleCustomerManage(record)}
                />
              </>
            )}
          </span>
        );
      },
    },
    {
      title: "权限",
      dataIndex: "roles",
      key: "roles",
      render: (roles: RoleItem[], record: UserItem) => {
        console.log("role1", roles, record);
        const role = roles[0];
        const isAdmin = adminList.includes(role?.name);
        const roleText = isAdmin ? "管理员" : "员工";
        const displayRole = roleText || "-";

        const roleMenuItems = [
          {
            key: "admin",
            label: (
              <div className={styles.roleItem}>
                <span>管理员</span>
                {isAdmin && <CircleCheck size={16} />}
              </div>
            ),
          },
          {
            key: "employee",
            label: (
              <div className={styles.roleItem}>
                <span>员工</span>
                {!isAdmin && <CircleCheck size={16} />}
              </div>
            ),
          },
        ];

        return (
          <Dropdown
            menu={{
              items: roleMenuItems,
              onClick: ({ key }) =>
                handleRoleChange(record.id, key as "admin" | "employee"),
              className: styles.roleDropdown,
            }}
            trigger={["click"]}
          >
            <a onClick={(e) => e.preventDefault()} className={styles.blackText}>
              {displayRole} <ChevronDown size={16} />
            </a>
          </Dropdown>
        );
      },
    },
    {
      title: "员工消息记录",
      key: "messages",
      render: (_, record) => (
        <span className={styles.blackText}>
          {employeeMessageCount[record.id] === undefined ||
          employeeMessageCount[record.id] === null
            ? "-"
            : employeeMessageCount[record.id]}
        </span>
      ),
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            className={`${styles.operationButton} ${styles.blackText}`}
            onClick={() => handleSendLoginGuide(record)}
          >
            发送登录引导
          </Button>
          <Button
            type="link"
            className={`${styles.operationButton} ${styles.blackText}`}
            onClick={() => handleEdit(record.id)}
          >
            编辑
          </Button>
          <Button
            type="link"
            className={`${styles.operationButton} ${styles.blackText}`}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    searchEmployees(value, pagination.pageSize);
  };

  const handleTableChange = (paginationConfig) => {
    setPagination({ current: paginationConfig.current, pageSize: paginationConfig.pageSize });
    fetchEmployees({ page: paginationConfig.current, pageSize: paginationConfig.pageSize });
  };

  return (
    <div className={styles.container}>
      {/* 顶部标题和搜索区 */}
      <div className={styles.header}>
        <Title level={4} className={styles.title}>
          员工管理
        </Title>
        <div className={styles.headerRight}>
          <Input
            placeholder="搜索员工"
            prefix={<SearchOutlined />}
            value={searchValue}
            onChange={handleSearchChange}
            style={{ width: 240 }}
          />
          <Button className={styles.addButton} onClick={showAddEmployeeModal}>
            添加员工
          </Button>
        </div>
      </div>

      {/* 员工表格 */}
      <div className={styles.tableContainer}>
        <Table
          columns={columns}
          dataSource={employees}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            showSizeChanger: true,
            showQuickJumper: false,
          }}
          onChange={handleTableChange}
        />
      </div>

      {/* 登录引导弹窗 */}
      <Modal
        title="发送邮件引导员工登录系统"
        open={loginGuideVisible}
        footer={null}
        onCancel={() => setLoginGuideVisible(false)}
        width={400}
        closable={false}
      >
        <div>
          <p>
            将发送一条包含"系统地址"以及员工个人登录的账号信息（邮箱&密码）的邮件，到员工邮箱。
          </p>
          <p>{currentEmployee?.email}</p>
          <div className={styles.cardActions}>
            <Button
              className={styles.cancelButton}
              onClick={() => setLoginGuideVisible(false)}
            >
              取消
            </Button>
            <Button
              className={styles.confirmButton}
              onClick={() => {
                console.log(`发送登录引导邮件到 ${currentEmployee?.email}`);
                setLoginGuideVisible(false);
              }}
            >
              确认发送
            </Button>
          </div>
        </div>
      </Modal>

      {/* 员工弹窗（新增/编辑） */}
      <Modal
        title={null}
        open={employeeModalVisible}
        footer={null}
        onCancel={handleEmployeeModalCancel}
        width={414}
        className={styles.addEmployeeModal}
        closable={true}
        closeIcon={<span style={{ fontSize: 20, color: "#999" }}>×</span>}
      >
        <div>
          <div className={styles.modalTitle}>
            {isEditMode ? "编辑员工" : "添加员工"}
          </div>

          {/* 头像上传区域 */}
          <div className={styles.sectionTitle}>头像</div>
          <div className={styles.avatarUploader}>
            <div className={styles.avatarCircle}>
              {avatarFile ? (
                <img
                  src={
                    avatarFile.url ||
                    (avatarFile.originFileObj &&
                      URL.createObjectURL(avatarFile.originFileObj))
                  }
                  alt="头像"
                />
              ) : (
                <PlusOutlined style={{ fontSize: 24, color: "#ccc" }} />
              )}
            </div>
            <Upload
              name="avatar"
              showUploadList={false}
              beforeUpload={beforeUpload}
              onChange={handleAvatarChange}
            >
              <div className={styles.uploadText}>
                <UploadOutlined />
                <span>上传头像</span>
              </div>
            </Upload>
          </div>

          {/* 基本信息表单 */}
          <div className={styles.sectionTitle}>基本信息</div>
          <Form form={form} layout="vertical" requiredMark={true} colon={true}>
            <Form.Item
              name="username"
              label="员工姓名"
              rules={[{ required: true, message: "请输入员工姓名" }]}
              className={styles.formItem}
            >
              <Input
                placeholder="请输入员工姓名"
                className={styles.customInput}
              />
            </Form.Item>

            <Form.Item
              name="email"
              label="邮箱"
              rules={[
                { required: true, message: "请输入员工邮箱" },
                { type: "email", message: "请输入有效的邮箱地址" },
              ]}
              className={styles.formItem}
            >
              <Input
                placeholder="请输入员工邮箱"
                className={styles.customInput}
              />
            </Form.Item>

            <Form.Item
              name="phone"
              label="手机号"
              rules={[
                { required: true, message: "请输入员工手机号" },
                { pattern: /^1[3-9]\d{9}$/, message: "请输入有效的手机号" },
              ]}
              className={styles.formItem}
            >
              <Input
                placeholder="请输入员工手机号"
                className={styles.customInput}
              />
            </Form.Item>
          </Form>

          {/* 底部按钮 */}
          <div className={styles.modalFooter}>
            <Button
              className={styles.cancelButton}
              onClick={handleEmployeeModalCancel}
            >
              取消
            </Button>
            <Button
              className={styles.confirmButton}
              onClick={handleEmployeeSubmit}
              loading={loading}
            >
              {isEditMode ? "保存修改" : "添加员工"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* 员工对接客户管理弹窗 */}
      <Modal
        title={null}
        open={customerModalVisible}
        footer={null}
        onCancel={() => setCustomerModalVisible(false)}
        width={680}
        style={{ top: 60 }}
        styles={{
          body: {
            borderRadius: 8,
            background: "#F4F4F4",
            padding: 24,
            height: 500,
            display: "flex",
            flexDirection: "column",
          },
        }}
        closable={false}
      >
        <div style={{ fontSize: 20, fontWeight: 500, marginBottom: 24 }}>
          员工对接客户管理
        </div>
        <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
          {/* 左侧 */}
          <div
            style={{
              width: 220,
              display: "flex",
              flexDirection: "column",
              marginRight: 24,
              minHeight: 0,
            }}
          >
            <Tabs
              activeKey={customerTab}
              onChange={setCustomerTab}
              items={[
                { key: "all", label: "全部客户" },
                { key: "unassigned", label: "未分配客户" },
              ]}
              style={{ marginBottom: 8 }}
            />
            <div
              style={{
                background: "#fff",
                flex: 1,
                borderRadius: 6,
                overflow: "auto",
                border: "1px solid #eee",
                display: "flex",
                flexDirection: "column",
                minHeight: 0,
              }}
            >
              {/* 标题栏 */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  borderBottom: "1px solid #eee",
                  padding: "0 12px",
                  height: 40,
                  fontWeight: 500,
                  flexShrink: 0,
                }}
              >
                <Checkbox
                  checked={
                    selectedLeft.length === leftList.length &&
                    leftList.length > 0
                  }
                  indeterminate={
                    selectedLeft.length > 0 &&
                    selectedLeft.length < leftList.length
                  }
                  onChange={(e) =>
                    setSelectedLeft(
                      e.target.checked ? leftList.map((c) => c.id) : []
                    )
                  }
                  style={{ marginRight: 8 }}
                />
                <span style={{ flex: 1 }}>客户名称</span>
                <span style={{ width: 60 }}>对接人</span>
              </div>
              {/* 客户项 */}
              <div style={{ flex: 1, overflow: "auto" }}>
                {leftList.map((c) => (
                  <div
                    key={c.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      borderBottom: "1px solid #eee",
                      padding: "0 12px",
                      height: 40,
                    }}
                  >
                    <Checkbox
                      checked={selectedLeft.includes(c.id)}
                      onChange={(e) => {
                        setSelectedLeft(
                          e.target.checked
                            ? [...selectedLeft, c.id]
                            : selectedLeft.filter((id) => id !== c.id)
                        );
                      }}
                      style={{ marginRight: 8 }}
                    />
                    <span style={{ flex: 1 }}>{c.name}</span>
                    <span style={{ width: 60 }}>{c.owner}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* 中间双箭头 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 16,
              width: 60,
            }}
          >
            <Button
              style={{
                width: 36,
                height: 36,
                border: "1px solid #ccc",
                background: "#fff",
                color: "#000",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              icon={<DoubleRightOutlined />}
              disabled={selectedLeft.length === 0}
              onClick={moveToRight}
            />
            <Button
              style={{
                width: 36,
                height: 36,
                border: "1px solid #ccc",
                background: "#fff",
                color: "#000",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              icon={<DoubleLeftOutlined />}
              disabled={selectedRight.length === 0}
              onClick={moveToLeft}
            />
          </div>
          {/* 右侧 */}
          <div
            style={{
              width: 320,
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
            }}
          >
            <div
              style={{
                fontWeight: 500,
                marginBottom: 8,
                height: 24,
                flexShrink: 0,
              }}
            >
              员工客户
            </div>
            <div
              style={{
                background: "#fff",
                flex: 1,
                borderRadius: 6,
                overflow: "auto",
                border: "1px solid #eee",
                display: "flex",
                flexDirection: "column",
                minHeight: 0,
              }}
            >
              {/* 标题栏 */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  borderBottom: "1px solid #eee",
                  padding: "0 12px",
                  height: 40,
                  fontWeight: 500,
                  flexShrink: 0,
                }}
              >
                <Checkbox
                  checked={
                    selectedRight.length === rightList.length &&
                    rightList.length > 0
                  }
                  indeterminate={
                    selectedRight.length > 0 &&
                    selectedRight.length < rightList.length
                  }
                  onChange={(e) =>
                    setSelectedRight(
                      e.target.checked ? rightList.map((c) => c.id) : []
                    )
                  }
                  style={{ marginRight: 8 }}
                />
                <span style={{ flex: 1 }}>客户名称</span>
              </div>
              {/* 客户项 */}
              <div style={{ flex: 1, overflow: "auto" }}>
                {rightList.map((c) => (
                  <div
                    key={c.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      borderBottom: "1px solid #eee",
                      padding: "0 12px",
                      height: 40,
                    }}
                  >
                    <Checkbox
                      checked={selectedRight.includes(c.id)}
                      onChange={(e) => {
                        setSelectedRight(
                          e.target.checked
                            ? [...selectedRight, c.id]
                            : selectedRight.filter((id) => id !== c.id)
                        );
                      }}
                      style={{ marginRight: 8 }}
                    />
                    <span style={{ flex: 1 }}>{c.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* 底部按钮 */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
            marginTop: 24,
          }}
        >
          <Button
            style={{
              background: "#fff",
              color: "#000",
              border: "1px solid #ccc",
            }}
            onClick={() => setCustomerModalVisible(false)}
          >
            取消
          </Button>
          <Button
            style={{ background: "#000", color: "#fff", border: "none" }}
            onClick={() => {
              // 保存逻辑
              setCustomerModalVisible(false);
            }}
          >
            保存
          </Button>
        </div>
      </Modal>
    </div>
  );
}
