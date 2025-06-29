import React, { useEffect } from "react";
import { Modal, Input, Button, Select, Slider, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { SliderWithInput } from '@lobehub/ui';
import { createStyles } from "antd-style";
import { useAgentStore } from '@/store/agent';
import { agentFormDefault } from '@/store/agent/slices/agent/initialState';

const { TextArea } = Input;

const useStyles = createStyles(({ css, token }) => ({
  modalBody: css`
    height: 560px;
    padding: 24px;
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
  `,
  layout: css`
    display: flex;
    flex: 1 1 0;
    min-height: 0;
  `,
  left: css`
    flex: 1;
    margin-right: 32px;
    height: 100%;
    display: flex;
    flex-direction: column;
    min-width: 0;
  `,
  textarea: css`
    flex: 1 1 0;
    min-height: 0;
    background: #eaeaea;
    resize: none !important;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    padding: 12px 16px;
    color: #222;
    font-weight: 500;
    line-height: 1.8;
    box-sizing: border-box;
    width: 100%;
    overflow: auto;
    box-shadow: none !important;
    &:hover, &:focus, &:active {
      border: none !important;
      box-shadow: none !important;
      background: #eaeaea !important;
    }
  `,
  right: css`
    width: 260px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    position: relative;
    height: 100%;
  `,
  label: css`
    font-size: 14px;
    font-weight: 400;
    color: #000;
    margin-bottom: 4px;
    line-height: 1.2;
  `,
  input: css`
    background: #eaeaea !important;
    border: none !important;
    border-radius: 6px !important;
    margin-bottom: 8px;
    font-size: 15px;
    height: 32px !important;
    color: #222 !important;
    box-shadow: none !important;
    &:hover, &:focus, &:active {
      border: none !important;
      box-shadow: none !important;
    }
  `,
  select: css`
    background: #eaeaea !important;
    border: none !important;
    border-radius: 6px !important;
    margin-bottom: 8px;
    font-size: 15px;
    height: 32px !important;
    width: 100%;
    box-shadow: none !important;
    .ant-select-selector {
      background: #eaeaea !important;
      border: none !important;
      border-radius: 6px !important;
      height: 32px !important;
      min-height: 32px !important;
      box-shadow: none !important;
      align-items: center;
    }
    &:hover, &:focus, &:active {
      border: none !important;
      box-shadow: none !important;
    }
  `,
  sliderRow: css`
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    gap: 8px;
  `,
  sliderLabel: css`
    width: 48px;
    font-size: 15px;
    color: #222;
  `,
  sliderLabelWide: css`
    width: 72px;
    font-size: 15px;
    color: #222;
  `,
  slider: css`
    width: 190px;
    background: #d9d9d9;
    .ant-slider-track {
      background: #518ded !important;
      height: 4px;
      border-radius: 2px;
    }
    .ant-slider-rail {
      background: #d9d9d9 !important;
      height: 4px;
      border-radius: 2px;
    }
    .ant-slider-handle {
      border-color: #518ded !important;
      background: #fff !important;
      width: 16px;
      height: 16px;
      margin-top: -6px;
    }
  `,
  sliderValue: css`
    width: 45px;
    text-align: right;
    font-size: 15px;
    color: #222;
  `,
  exampleImg: css`
    width: 112px;
    height: 62px;
    background: #eaeaea;
    margin: 8px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    overflow: hidden;
  `,
  uploadBtn: css`
    padding: 0;
    color: #518ded !important;
    font-weight: 500;
    font-size: 15px;
    height: 32px;
    line-height: 32px;
  `,
  footer: css`
    height: 36px;
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    background: #fff;
    position: absolute;
    right: 0;
    bottom: 0;
    width: 100%;
    padding-bottom: 0;
    z-index: 2;
  `,
  cancelBtn: css`
    border-radius: 6px;
    font-size: 14px;
    height: 36px;
    color: #222;
    background: #fff;
    border: 1px solid #eaeaea;
  `,
  saveBtn: css`
    border-radius: 6px;
    font-size: 14px;
    height: 36px;
    background: #000;
    border: none;
  `,
}));

interface TemplateModalProps {
  open: boolean;
  onCancel: () => void;
  onOk: (values: any) => void;
  loading?: boolean;
  initialValues?: any;
  modelOptions: { label: string; value: string }[];
  onUploadImage?: (file: File) => Promise<string>;
}

const TemplateModal: React.FC<TemplateModalProps> = ({
  open,
  onCancel,
  onOk,
  loading,
  initialValues,
  modelOptions,
  onUploadImage,
}) => {
  const { styles } = useStyles();
  const createAgent = useAgentStore((s) => s.createAgent);
  const updateAgent = useAgentStore((s) => s.updateAgent);
  const uploadAvatar = useAgentStore((s) => s.uploadAvatar);

  const [form, setForm] = React.useState({
    ...agentFormDefault,
  });
  const [uploading, setUploading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  useEffect(() => {
    if (open) {
      if (initialValues) {
        setForm({
          ...agentFormDefault,
          ...initialValues,
        });
      } else {
        setForm({ ...agentFormDefault });
      }
    }
  }, [open, initialValues]);

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleUpload = async ({ file }: any) => {
    setUploading(true);
    try {
      const url = await uploadAvatar(file);
      setForm((prev) => ({ ...prev, avatar: url }));
      message.success("上传成功");
    } catch {
      message.error("上传失败");
    } finally {
      setUploading(false);
    }
  };

  const handleOk = async () => {
    setSaving(true);
    try {
      if (initialValues && initialValues.id) {
        await updateAgent(initialValues.id, {
          ...initialValues,
          ...form,
        });
      } else {
        await createAgent({
          ...form,
        });
      }
      onOk(form);
    } catch (e: any) {
      message.error(e?.message || "保存失败");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title="客户类型"
      open={open}
      onCancel={onCancel}
      footer={null}
      width={840}
      styles={{
        body: {
          height: 600,
          marginTop: 16,
          display: "flex",
          flexDirection: "column",
        },
      }}
      style={{ background: "#F4F4F4" }}
      centered
    >
      <div className={styles.layout}>
        {/* 左侧大文本编辑区 */}
        <div className={styles.left}>
          <TextArea
            value={form.prompt}
            onChange={(e) => handleChange("prompt", e.target.value)}
            placeholder="请输入系统提示词"
            className={styles.textarea}
          />
        </div>
        {/* 右侧表单区 */}
        <div className={styles.right}>
          <div>
            <div className={styles.label}>命名</div>
            <Input
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="请输入名称"
              className={styles.input}
            />
          </div>
          <div>
            <div className={styles.label}>简介</div>
            <Input
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="请输入简介"
              className={styles.input}
            />
          </div>
          <div>
            <div className={styles.label}>模型</div>
            <Select
              value={form.model}
              onChange={(v) => handleChange("model", v)}
              placeholder="请选择模型"
              options={modelOptions}
              className={styles.select}
              dropdownStyle={{ background: "#EAEAEA" }}
            />
          </div>
          <div>
            <div className={styles.label}>温度</div>
            <SliderWithInput
              min={0}
              max={1}
              step={0.1}
              value={form.temperature}
              onChange={(v) => handleChange("temperature", v)}
              styles={{
                root: { display: 'flex', alignItems: 'center', gap: 8 },
                slider: { width: 190 },
                input: { width: 45 },
              }}
            />
          </div>
          <div>
            <div className={styles.label}>最大令牌数</div>
            <SliderWithInput
              min={256}
              max={4096}
              step={1}
              value={form.maxTokens}
              onChange={(v) => handleChange("maxTokens", v)}
              styles={{
                root: { display: 'flex', alignItems: 'center', gap: 8 },
                slider: { width: 190 },
                input: { width: 45 },
              }}
            />
          </div>
          <div>
            <div className={styles.label}>示例图</div>
            <div className={styles.exampleImg}>
              {form.avatar ? (
                <img
                  src={form.avatar}
                  alt="示例图"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : null}
            </div>
          </div>
          <div>
            <Upload
              customRequest={handleUpload}
              showUploadList={false}
              accept="image/*"
              disabled={uploading}
            >
              <Button
                type="link"
                icon={<UploadOutlined />}
                className={styles.uploadBtn}
                loading={uploading}
              >
                上传图片
              </Button>
            </Upload>
          </div>
          <div className={styles.footer}>
            <Button onClick={onCancel} className={styles.cancelBtn}>取消</Button>
            <Button type="primary" onClick={handleOk} loading={loading || saving} className={styles.saveBtn}>保存</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TemplateModal;
