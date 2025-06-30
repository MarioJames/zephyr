import React from "react";
import { Form, Upload } from "antd";
import { Button, Input, Modal } from "@lobehub/ui";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { createStyles } from "antd-style";

const useStyles = createStyles(({ css, token }) => ({
  addEmployeeModal: css`
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
    background: ${token.colorFillQuaternary};
    height: 32px;
    border: none;
    box-shadow: none;
    &:hover,
    &:focus,
    &:active {
      background: ${token.colorFillQuaternary} !important;
      border: none !important;
      box-shadow: none !important;
    }
  `,
  cancelButton: css`
    border: 1px solid rgba(0, 0, 0, 0.15);
  `,
}));

export interface EmployeeEditModalProps {
  open: boolean;
  isEditMode: boolean;
  loading: boolean;
  form: any;
  avatarFile: any;
  onCancel: () => void;
  onSubmit: () => void;
  beforeUpload: (file: File) => Promise<boolean>;
  onAvatarChange: (info: any) => void;
  setAvatarFile: (file: any) => void;
}

const EmployeeEditModal: React.FC<EmployeeEditModalProps> = ({
  open,
  isEditMode,
  loading,
  form,
  avatarFile,
  onCancel,
  onSubmit,
  beforeUpload,
  onAvatarChange,
  setAvatarFile,
}) => {
  const { styles } = useStyles();
  return (
    <Modal
      title={null}
      open={open}
      footer={null}
      onCancel={onCancel}
      width={414}
      className={styles.addEmployeeModal}
      closable={true}
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
            onChange={onAvatarChange}
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
          <Button className={styles.cancelButton} onClick={onCancel}>
            取消
          </Button>
          <Button type="primary" onClick={onSubmit} loading={loading}>
            {isEditMode ? "保存修改" : "添加员工"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EmployeeEditModal;
