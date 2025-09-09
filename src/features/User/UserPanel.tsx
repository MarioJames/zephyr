'use client';

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
} from 'antd';
import { createStyles } from 'antd-style';
import { PropsWithChildren, memo, useState } from 'react';
import {
  UserOutlined,
  KeyOutlined,
  LogoutOutlined,
  LockOutlined,
} from '@ant-design/icons';
import { useGlobalStore } from '@/store/global';
import { globalSelectors } from '@/store/global/selectors';
import { changeUserPassword } from '@/services/casdoor';
import { logout } from '@/utils/logout';

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

const PanelContent = memo(() => {
  const { styles } = useStyles();
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const currentUser = useGlobalStore((state) => state.currentUser);
  const isAdmin = useGlobalStore(globalSelectors.isCurrentUserAdmin);

  // 处理修改密码
  const handleChangePassword = async (values: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    setLoading(true);
    try {
      // 验证两次新密码是否一致
      if (values.newPassword !== values.confirmPassword) {
        message.error('两次输入的新密码不一致');
        return;
      }

      // 从store获取当前用户信息
      const currentUserInfo = {
        name: currentUser?.username || currentUser?.fullName,
        email: currentUser?.email,
        id: currentUser?.id,
      };

      // 调用密码修改接口，传递用户信息
      const requestData = {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
        userInfo: currentUserInfo,
      };

      await changeUserPassword(requestData);

      message.success('密码修改成功');
      setChangePasswordModalOpen(false);
      form.resetFields();
    } catch (error: any) {
      console.error('密码修改失败:', error);
      message.error(error.response?.data?.error || '密码修改失败');
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    {
      key: 'changePassword',
      icon: (
        <KeyOutlined className={styles.menuIcon} style={{ fontSize: 16 }} />
      ),
      label: '修改密码',
      onClick: () => setChangePasswordModalOpen(true),
    },
    {
      key: 'logout',
      icon: (
        <LogoutOutlined className={styles.menuIcon} style={{ fontSize: 16 }} />
      ),
      label: '退出登录',
      onClick: logout,
    },
  ];

  return (
    <div className={styles.panelContent}>
      <div className={styles.userInfo}>
        <Avatar size={40} src={currentUser?.avatar} icon={<UserOutlined />} />
        <div className={styles.userDetails}>
          <Text className={styles.userName}>
            {currentUser?.fullName || currentUser?.username || '未知用户'}
          </Text>
          <Text className={styles.userEmail}>
            {currentUser?.email || '未设置邮箱'}
          </Text>
        </div>
        <Tag className={styles.roleTag} color={isAdmin ? 'red' : 'blue'}>
          {isAdmin ? '管理员' : '普通员工'}
        </Tag>
      </div>

      <Divider style={{ margin: 0 }} />

      <div className={styles.menuContainer}>
        <Menu mode='vertical' items={menuItems} selectable={false} />
      </div>

      <Modal
        title='修改密码'
        open={changePasswordModalOpen}
        onCancel={() => {
          setChangePasswordModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        width={400}
      >
        <Form
          form={form}
          layout='vertical'
          onFinish={handleChangePassword}
          autoComplete='off'
        >
          <Form.Item
            label='当前密码'
            name='oldPassword'
            rules={[{ required: true, message: '请输入当前密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder='请输入当前密码'
              autoComplete='current-password'
            />
          </Form.Item>

          <Form.Item
            label='新密码'
            name='newPassword'
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '密码长度至少为 6 位' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder='请输入新密码'
              autoComplete='new-password'
            />
          </Form.Item>

          <Form.Item
            label='确认新密码'
            name='confirmPassword'
            rules={[
              { required: true, message: '请再次输入新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder='请再次输入新密码'
              autoComplete='new-password'
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <div
              style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}
            >
              <Button
                onClick={() => {
                  setChangePasswordModalOpen(false);
                  form.resetFields();
                }}
              >
                取消
              </Button>
              <Button type='primary' htmlType='submit' loading={loading}>
                确认修改
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
      placement={'topRight'}
      rootClassName={styles.popover}
      styles={{
        body: { padding: 0 },
      }}
      trigger={['click']}
    >
      {children}
    </Popover>
  );
});

UserPanel.displayName = 'UserPanel';

export default UserPanel;
