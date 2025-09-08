import React from 'react';
import { Form, Upload, Select, App } from 'antd';
import { Button, Input, Modal } from '@lobehub/ui';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { createStyles } from 'antd-style';
import Image from 'next/image';
import { RoleItem } from '@/services/roles';

const useStyles = createStyles(({ css, token }) => ({
  addEmployeeModal: css`
    .ant-modal-body {
      padding-block: 0 !important;
      padding-inline: 0 !important;
    }
    .ant-modal-content {
      border-radius: 8px;
      background: ${token.colorBgElevated};
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
    background: ${token.colorFillTertiary};
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
  customInput: css`
    border-radius: 6px;
    background: ${token.colorFillTertiary};
    height: 32px;
    border: none;
    box-shadow: none;
    &:hover,
    &:focus,
    &:active {
      background: ${token.colorFillTertiary} !important;
      border: none !important;
      box-shadow: none !important;
    }
  `,
  customSelect: css`
    .ant-select-selector {
      border-radius: 6px !important;
      background: ${token.colorFillTertiary} !important;
      border: none !important;
      box-shadow: none !important;
      height: 32px !important;
      .ant-select-selection-search-input {
        height: 32px !important;
      }
      .ant-select-selection-item {
        line-height: 32px !important;
      }
      .ant-select-selection-placeholder {
        line-height: 32px !important;
      }
    }
    &:hover .ant-select-selector {
      background: ${token.colorFillTertiary} !important;
      border: none !important;
    }
  `,
  cancelButton: css`
    border: 1px solid ${token.colorBorder};
  `,
}));

export interface EmployeeEditModalProps {
  open: boolean;
  isEditMode: boolean;
  loading: boolean;
  form: any;
  avatarFile: any;
  avatarUploading?: boolean;
  roles: RoleItem[];
  onCancel: () => void;
  onSubmit: () => void;
  beforeUpload: (file: File) => Promise<boolean>;
  onAvatarChange: (info: any) => void;
}

const EmployeeEditModal: React.FC<EmployeeEditModalProps> = ({
  open,
  isEditMode,
  loading,
  form,
  avatarFile,
  avatarUploading = false,
  roles,
  onCancel,
  onSubmit,
  beforeUpload,
  onAvatarChange,
}) => {
  const { styles } = useStyles();
  const { modal } = App.useApp();

  const handleRoleChange = (roleId: string) => {
    const selected = roles.find((r) => r.id === roleId);
    if (selected && selected.isActive === false) {
      modal.confirm({
        title: '提示',
        content: '选中的角色未激活，对应账号无法进入系统',
        okText: '我知道了',
        okCancel: false,
      });
    }
  };

  return (
    <Modal
      className={styles.addEmployeeModal}
      closable={true}
      footer={null}
      onCancel={onCancel}
      open={open}
      title={null}
      width={414}
      styles={{
        content: {
          height: 610,
        },
        body: {
          minHeight: 610,
        },
      }}
      style={{ top: 40 }}
    >
      <div>
        <div className={styles.modalTitle}>
          {isEditMode ? '编辑员工' : '添加员工'}
        </div>
        {/* 头像上传区域 */}
        <div className={styles.sectionTitle}>头像</div>
        <div className={styles.avatarUploader}>
          <div className={styles.avatarCircle}>
            {avatarFile ? (
              <Image
                alt='头像'
                height={48}
                src={
                  avatarFile.url ||
                  (avatarFile.originFileObj &&
                    URL.createObjectURL(avatarFile.originFileObj))
                }
                width={48}
              />
            ) : (
              <PlusOutlined style={{ fontSize: 24, color: '#ccc' }} />
            )}
          </div>
          <Upload
            beforeUpload={beforeUpload}
            disabled={avatarUploading}
            name='avatar'
            onChange={onAvatarChange}
            showUploadList={false}
          >
            <Button
              disabled={avatarUploading}
              icon={<UploadOutlined />}
              loading={avatarUploading}
              type='text'
            >
              {avatarUploading ? '上传中...' : '上传头像'}
            </Button>
          </Upload>
        </div>
        {/* 基本信息表单 */}
        <div className={styles.sectionTitle}>基本信息</div>
        <Form colon={true} form={form} layout='vertical' requiredMark={true}>
          <Form.Item
            className={styles.formItem}
            label='员工姓名'
            name='fullName'
            rules={[{ required: true, message: '请输入员工姓名' }]}
          >
            <Input
              className={styles.customInput}
              placeholder='请输入员工姓名'
            />
          </Form.Item>
          <Form.Item
            className={styles.formItem}
            label='邮箱'
            name='email'
            rules={[
              { required: true, message: '请输入员工邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input
              className={styles.customInput}
              placeholder='请输入员工邮箱'
            />
          </Form.Item>
          <Form.Item
            className={styles.formItem}
            label='手机号'
            name='phone'
            rules={[{ required: true, message: '请输入员工手机号' }]}
          >
            <Input
              className={styles.customInput}
              placeholder='请输入员工手机号'
            />
          </Form.Item>
          <Form.Item
            className={styles.formItem}
            label='角色'
            name='roleId'
            rules={[{ required: true, message: '请选择员工角色' }]}
          >
            <Select
              className={styles.customSelect}
              placeholder='请选择员工角色'
              options={roles.map((role) => ({
                label: role.displayName,
                value: role.id,
              }))}
              onChange={handleRoleChange}
            />
          </Form.Item>
        </Form>
        {/* 底部按钮 */}
        <div className={styles.modalFooter}>
          <Button className={styles.cancelButton} onClick={onCancel}>
            取消
          </Button>
          <Button loading={loading} onClick={onSubmit} type='primary'>
            {isEditMode ? '保存修改' : '添加员工'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EmployeeEditModal;
