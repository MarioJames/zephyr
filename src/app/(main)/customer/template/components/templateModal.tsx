import React, { useEffect } from "react";
import { Upload, message, Form } from "antd";
import { Button, TextArea, Input, Select, Modal } from "@lobehub/ui";
import { UploadOutlined } from "@ant-design/icons";
import { SliderWithInput } from "@lobehub/ui";
import Image from "next/image";
import { createStyles } from "antd-style";
import { useAgentStore } from "@/store/agent";
import { AGAENT_DEFAULT_CONFIG } from "@/const/agent";
import { isValidImageUrl } from "@/utils/avatar";
import isEmpty from "lodash-es/isEmpty";

const useStyles = createStyles(({ css, token }) => ({
  layout: css`
    display: flex;
    flex: 1 1 0;
    min-height: 0;

    .ant-form-item {
      margin-bottom: 0;
    }
  `,
  left: css`
    flex: 1;
    margin-right: 32px;
    display: flex;
    flex-direction: column;
    min-width: 0;
  `,
  textarea: css`
    flex: 1 1 0;
    height: 520px !important;
    background: ${token.colorFillTertiary};
    resize: none !important;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    padding: 12px 16px;
    color: ${token.colorText};
    font-weight: 500;
    line-height: 1.8;
    box-sizing: border-box;
    width: 100%;
    overflow: auto;
    box-shadow: none !important;
    &:hover,
    &:focus,
    &:active {
      border: none !important;
      box-shadow: none !important;
      background: ${token.colorFillTertiary} !important;
    }
  `,
  right: css`
    width: 260px;
    display: flex;
    flex-direction: column;
    position: relative;
    height: 520px;
    overflow-y: hidden;
  `,
  contentArea: css`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;
    overflow-y: auto;
    height: 200px;
    padding-bottom: 24px;
  `,
  label: css`
    font-size: 14px;
    font-weight: 400;
    color: ${token.colorText};
    margin-bottom: 4px;
    line-height: 1.2;
  `,
  input: css`
    background: ${token.colorFillTertiary} !important;
    border: none !important;
    border-radius: 6px !important;
    margin-bottom: 8px;
    font-size: 15px;
    height: 32px !important;
    color: ${token.colorText} !important;
    box-shadow: none !important;
    &:hover,
    &:focus,
    &:active {
      border: none !important;
      box-shadow: none !important;
    }
  `,
  select: css`
    background: ${token.colorFillTertiary} !important;
    border: none !important;
    border-radius: 6px !important;
    margin-bottom: 8px;
    font-size: 15px;
    height: 32px !important;
    width: 100%;
    box-shadow: none !important;
    .ant-select-selector {
      background: ${token.colorFillTertiary} !important;
      border: none !important;
      border-radius: 6px !important;
      height: 32px !important;
      min-height: 32px !important;
      box-shadow: none !important;
      align-items: center;
    }
    &:hover,
    &:focus,
    &:active {
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
    color: ${token.colorText};
  `,
  sliderLabelWide: css`
    width: 72px;
    font-size: 15px;
    color: ${token.colorText};
  `,
  slider: css`
    width: 190px;
    background: ${token.colorFill};
    .ant-slider-track {
      background: ${token.colorPrimary} !important;
      height: 4px;
      border-radius: 2px;
    }
    .ant-slider-rail {
      background: ${token.colorFill} !important;
      height: 4px;
      border-radius: 2px;
    }
    .ant-slider-handle {
      border-color: ${token.colorPrimary} !important;
      background: ${token.colorBgContainer} !important;
      width: 16px;
      height: 16px;
      margin-top: -6px;
    }
  `,
  sliderValue: css`
    width: 45px;
    text-align: right;
    font-size: 15px;
    color: ${token.colorText};
  `,
  exampleImg: css`
    width: 112px;
    height: 62px;
    background: ${token.colorFillTertiary};
    margin: 8px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    overflow: hidden;
  `,
  uploadBtn: css`
    padding: 0;
    color: ${token.colorPrimary} !important;
    font-weight: 500;
    font-size: 15px;
    height: 32px;
    line-height: 32px;
  `,
  footer: css`
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 16px 0 0 0;
    margin-top: auto;
  `,
  cancelBtn: css`
    flex: 1;
    border-radius: 6px;
    font-size: 14px;
    height: 36px;
    color: ${token.colorText};
    background: ${token.colorBgContainer};
    border: 1px solid ${token.colorBorder};
  `,
  saveBtn: css`
    flex: 1;
    border-radius: 6px;
    font-size: 14px;
    height: 36px;
    background: ${token.colorText};
    border: none;
  `,
}));

interface TemplateModalProps {
  open: boolean;
  onCancel: () => void;
  onOk: (values: any) => void;
  loading?: boolean;
  initialValues?: any;
  modelOptions: {
    label: string;
    value: string;
    key?: string;
  }[];
  onUploadImage?: (file: File) => Promise<string>;
}

const TemplateModal: React.FC<TemplateModalProps> = ({
  open,
  onCancel,
  onOk,
  loading,
  initialValues,
  modelOptions,
}) => {
  const { styles, theme } = useStyles();
  const uploadAvatar = useAgentStore((s) => s.uploadAvatar);

  const [form] = Form.useForm();
  const [uploading, setUploading] = React.useState(false);

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        ...AGAENT_DEFAULT_CONFIG,
        ...(initialValues || {}),
        provider: 'openai',
        model: !isEmpty(modelOptions) ? modelOptions[0]?.value : undefined,
        params: {
          ...AGAENT_DEFAULT_CONFIG.params,
          ...(initialValues?.params || {}),
        },
      });
    }
  }, [open, initialValues]);

  const handleUpload = async ({ file }: any) => {
    setUploading(true);
    try {
      const url = await uploadAvatar(file);

      form.setFieldValue("avatar", url);
      message.success("上传成功");
    } catch {
      message.error("上传失败");
    } finally {
      setUploading(false);
    }
  };

  const handleOk = () => {
    const values = form.getFieldsValue();
    if (!values.provider || !values.model) {
      message.error("请选择模型后再进行保存");
      return;
    }
    if (!values.avatar) {
      values.avatar = "";
    }
    onOk(values);
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
          display: "flex",
          flexDirection: "column",
        },
        header: {
          justifyContent: "flex-start",
        },
      }}
      centered
    >
      <Form layout="vertical" form={form}>
        <div className={styles.layout}>
          {/* 左侧大文本编辑区 */}
          <div className={styles.left}>
            <Form.Item name="systemRole">
              <TextArea
                placeholder="请输入系统提示词"
                className={styles.textarea}
              />
            </Form.Item>
          </div>
          {/* 右侧表单区 */}
          <div className={styles.right}>
            <div className={styles.contentArea}>
              <Form.Item label="命名" name="title" required>
                <Input placeholder="请输入名称" className={styles.input} />
              </Form.Item>
              <Form.Item label="简介" name="description">
                <Input placeholder="请输入简介" className={styles.input} />
              </Form.Item>
              <Form.Item label="模型提供商" name="provider" hidden>
                <Input />
              </Form.Item>
              <Form.Item label="模型" name="model" required>
                <Select
                  placeholder="请选择模型"
                  options={modelOptions}
                  className={styles.select}
                />
              </Form.Item>
              <Form.Item
                label="温度"
                name={["params", "temperature"]}
                tooltip="温度越高，模型越随机，温度越低，模型越确定"
              >
                <SliderWithInput min={0} max={2} step={0.1} />
              </Form.Item>
              <Form.Item
                label="最大令牌数"
                name={["params", "maxTokens"]}
                tooltip="最大令牌数越大，模型生成的内容越长，最大令牌数越小，模型生成的内容越短"
              >
                <SliderWithInput min={256} max={4096} step={1} />
              </Form.Item>
              <Form.Item
                label="思维开放度"
                name={["params", "topP"]}
                tooltip="思维开放度越高，模型越随机，思维开放度越低，模型越确定"
              >
                <SliderWithInput min={0} max={1} step={0.1} />
              </Form.Item>
              <Form.Item
                label="表达发散度"
                name={["params", "presencePenalty"]}
                tooltip="表达发散度越高，模型越随机，表达发散度越低，模型越确定"
              >
                <SliderWithInput min={-2} max={2} step={0.1} />
              </Form.Item>
              <Form.Item
                label="词汇丰富度"
                name={["params", "frequencyPenalty"]}
                tooltip="词汇丰富度越高，模型越随机，词汇丰富度越低，模型越确定"
              >
                <SliderWithInput min={-2} max={2} step={0.1} />
              </Form.Item>
              <Form.Item name="avatar" hidden>
                <Input />
              </Form.Item>
              <Form.Item label="示例图" shouldUpdate>
                {({ getFieldValue }) => {
                  const avatar = getFieldValue("avatar");

                  if (!avatar || !isValidImageUrl(avatar)) {
                    return (
                      <div
                        style={{
                          width: 112,
                          height: 62,
                          background: theme.colorFillTertiary,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "28px",
                          borderRadius: "8px",
                        }}
                      >
                        {avatar}
                      </div>
                    );
                  }

                  return (
                    <Image src={avatar} alt="示例图" width={112} height={62} />
                  );
                }}
              </Form.Item>
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
            </div>
            <div className={styles.footer}>
              <Button onClick={onCancel} className={styles.cancelBtn}>
                取消
              </Button>
              <Button
                type="primary"
                onClick={handleOk}
                loading={loading || uploading}
                className={styles.saveBtn}
              >
                保存
              </Button>
            </div>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default TemplateModal;
