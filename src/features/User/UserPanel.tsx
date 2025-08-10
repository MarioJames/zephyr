"use client";

import {
  Popover,
  Avatar,
  Typography,
  Divider,
  Menu,
  Modal,
  Form,
  Input,
  Button,
  Tag,
  message,
} from "antd";
import { createStyles } from "antd-style";
import { PropsWithChildren, memo, useState } from "react";
import {
  UserOutlined,
  KeyOutlined,
  LogoutOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { useGlobalStore } from "@/store/global";
import { globalSelectors } from "@/store/global/selectors";

const { Text } = Typography;

const useStyles = createStyles(({ css, token }) => {
  return {
    popover: css`
      inset-block-start: 8px !important;
      inset-inline-start: 8px !important;
    `,
    panelContent: css`
      width: 290px;
      border-radius: 6px;
    `,
    userInfo: css`
      height: 72px;
      padding: 12px;
      display: flex;
      align-items: center;
      gap: 12px;
    `,
    userDetails: css`
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    `,
    userName: css`
      font-size: 14px;
      font-weight: 500;
      color: ${token.colorText};
      margin: 0;
    `,
    userEmail: css`
      font-size: 12px;
      color: ${token.colorTextSecondary};
      margin: 0;
    `,
    roleTag: css`
      margin-left: auto;
    `,
    menuContainer: css`
      .ant-menu {
        border-radius: 6px;
      }
      .ant-menu-item {
        margin: 4px;
        padding: 6px 12px;
        display: flex;
        align-items: center;

        &:hover {
          background-color: ${token.colorBgTextHover};
        }
      }
    `,
    menuIcon: css`
      margin-right: 4px;
    `,
  };
});

// 处理退出登录
const handleLogout = () => {
  // TODO: 调用退出登录接口
  console.log("退出登录");
  message.success("退出登录成功");
};

const PanelContent = memo(() => {
  const { styles } = useStyles();
  const [resetPasswordModalOpen, setResetPasswordModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const currentUser = useGlobalStore((state) => state.currentUser);
  const isAdmin = useGlobalStore(globalSelectors.isCurrentUserAdmin);

  // 处理修改密码
  const handleResetPassword = async (values: { email: string }) => {
    setLoading(true);
    try {
      // TODO: 调用重置密码接口
      // await resetPasswordAPI(values.email);
      console.log("重置密码邮箱:", values.email);
      message.success("重置密码邮件已发送，请查看邮箱");
      setResetPasswordModalOpen(false);
      form.resetFields();
    } catch {
      message.error("发送重置密码邮件失败");
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    {
      key: "resetPassword",
      icon: (
        <KeyOutlined className={styles.menuIcon} style={{ fontSize: 16 }} />
      ),
      label: "修改密码",
      onClick: () => setResetPasswordModalOpen(true),
    },
    {
      key: "logout",
      icon: (
        <LogoutOutlined className={styles.menuIcon} style={{ fontSize: 16 }} />
      ),
      label: "退出登录",
      onClick: handleLogout,
    },
  ];

  return (
    <div className={styles.panelContent}>
      <div className={styles.userInfo}>
        <Avatar size={40} src={currentUser?.avatar} icon={<UserOutlined />} />
        <div className={styles.userDetails}>
          <Text className={styles.userName}>
            {currentUser?.fullName || currentUser?.username || "未知用户"}
          </Text>
          <Text className={styles.userEmail}>
            {currentUser?.email || "未设置邮箱"}
          </Text>
        </div>
        <Tag className={styles.roleTag} color={isAdmin ? "red" : "blue"}>
          {isAdmin ? "管理员" : "普通员工"}
        </Tag>
      </div>

      <Divider style={{ margin: 0 }} />

      <div className={styles.menuContainer}>
        <Menu mode="vertical" items={menuItems} selectable={false} />
      </div>

      <Modal
        title="修改密码"
        open={resetPasswordModalOpen}
        onCancel={() => {
          setResetPasswordModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        width={400}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleResetPassword}
          initialValues={{ email: currentUser?.email }}
        >
          <Form.Item
            label="邮箱地址"
            name="email"
            rules={[
              { required: true, message: "请输入邮箱地址" },
              { type: "email", message: "请输入有效的邮箱地址" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="请输入邮箱地址" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <div
              style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}
            >
              <Button
                onClick={() => {
                  setResetPasswordModalOpen(false);
                  form.resetFields();
                }}
              >
                取消
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                发送重置邮件
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
});

const UserPanel = memo<PropsWithChildren>(({ children }) => {
  const [open, setOpen] = useState(false);
  const { styles } = useStyles();

  return (
    <Popover
      arrow={false}
      content={<PanelContent />}
      onOpenChange={setOpen}
      open={open}
      placement={"topRight"}
      rootClassName={styles.popover}
      styles={{
        body: { padding: 0 },
      }}
      trigger={["click"]}
    >
      {children}
    </Popover>
  );
});

UserPanel.displayName = "UserPanel";

export default UserPanel;
