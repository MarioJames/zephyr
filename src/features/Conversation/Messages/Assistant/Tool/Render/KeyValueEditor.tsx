import { ActionIcon, Button, Icon, Input } from '@lobehub/ui';
import { App, Form, FormInstance } from 'antd';
import { createStyles } from 'antd-style';
import { LucidePlus, LucideTrash } from 'lucide-react';
import { memo, useEffect, useRef, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

const useStyles = createStyles(({ css, token }) => ({
  form: css`
    position: relative;

    width: 100%;
    min-width: 600px;
    padding-block: 8px;
    padding-inline: 12px;
    border: 1px solid ${token.colorBorder};
    border-radius: ${token.borderRadiusLG}px;
  `,
  formItem: css`
    margin-block-end: 4px !important;
  `,
  input: css`
    font-family: ${token.fontFamilyCode};
    font-size: 12px;
  `,
  row: css`
    position: relative;
  `,
  title: css`
    color: ${token.colorTextTertiary};
  `,
}));

interface KeyValueItem {
  id: string;
  key?: string;
  value?: string;
}

interface KeyValueEditorProps {
  initialValue?: Record<string, any>;
  onCancel?: () => void;
  onFinish?: (value: Record<string, any>) => Promise<void>;
}

const recordToFormList = (record: Record<string, any>): KeyValueItem[] =>
  Object.entries(record)
    .map(([key, val], index) => ({
      id: `${key}-${index}`,
      key,
      value: typeof val === 'string' ? val : JSON.stringify(val),
    }))
    .filter((item) => item.key);

const formListToRecord = (list: KeyValueItem[]): Record<string, any> => {
  const record: Record<string, any> = {};
  list.forEach((item) => {
    if (item.key) {
      try {
        record[item.key] = JSON.parse(item.value || '""');
      } catch {
        record[item.key] = item.value || '';
      }
    }
  });
  return record;
};

const KeyValueEditor = memo<KeyValueEditorProps>(({ initialValue = {}, onFinish, onCancel }) => {
  const { styles } = useStyles();
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const formRef = useRef<FormInstance>(null);

  useEffect(() => {
    form.setFieldsValue({ items: recordToFormList(initialValue) });
  }, [initialValue, form]);

  const [updating, setUpdating] = useState(false);
  const handleFinish = async () => {
    setUpdating(true);
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      const record = formListToRecord(values.items || []);
      await onFinish?.(record);
    } catch (errorInfo) {
      console.error('Validation Failed:', errorInfo);
      message.error('请检查表单是否有误。');
    }
    setUpdating(false);
  };

  const handleCancel = () => {
    onCancel?.();
  };

  const validateKeys = (_: any, item: KeyValueItem, items: KeyValueItem[]) => {
    if (!item?.key) {
      return Promise.resolve();
    }
    const keys = items.map((i) => i?.key).filter(Boolean);
    if (keys.filter((k) => k === item.key).length > 1) {
      return Promise.reject(new Error('存在重复的 key'));
    }

    return Promise.resolve();
  };

  return (
    <Form
      autoComplete="off"
      className={styles.form}
      form={form}
      initialValues={{ items: recordToFormList(initialValue) }}
      ref={formRef}
    >
      <Flexbox className={styles.title} gap={8} horizontal>
        <Flexbox flex={1}>key</Flexbox>
        <Flexbox flex={4}>value</Flexbox>
      </Flexbox>
      <Form.List name="items">
        {(fields, { add, remove }) => (
          <Flexbox width={'100%'}>
            {fields.map(({ key, name, ...restField }, index) => (
              <Flexbox
                align="center"
                className={styles.row}
                gap={8}
                horizontal
                key={key}
                width={'100%'}
              >
                <Form.Item
                  {...restField}
                  className={styles.formItem}
                  name={[name, 'key']}
                  rules={[
                    { message: 'key 必填', required: true },
                    {
                      validator: (rule) =>
                        validateKeys(
                          rule,
                          form.getFieldValue(['items', index]),
                          form.getFieldValue('items'),
                        ),
                    },
                  ]}
                  style={{ flex: 1 }}
                  validateTrigger={['onChange', 'onBlur']}
                >
                  <Input
                    allowClear
                    className={styles.input}
                    placeholder={'请输入 key'}
                    variant={'filled'}
                  />
                </Form.Item>
                <Form.Item
                  {...restField}
                  className={styles.formItem}
                  name={[name, 'value']}
                  style={{ flex: 4 }}
                >
                  <Input
                    allowClear
                    className={styles.input}
                    placeholder={'请输入 value'}
                    variant={'filled'}
                  />
                </Form.Item>
                <ActionIcon
                  icon={LucideTrash}
                  onClick={() => remove(name)}
                  size={'small'}
                  style={{
                    marginBottom: 6,
                  }}
                  title={'删除'}
                />
              </Flexbox>
            ))}
            <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
              <Flexbox gap={8} horizontal justify={'space-between'}>
                <Button
                  color={'default'}
                  icon={<Icon icon={LucidePlus} />}
                  onClick={() => add({ id: `new-${Date.now()}`, key: '', value: '' })}
                  size={'small'}
                  variant="filled"
                >
                  {'添加'}
                </Button>

                <Flexbox gap={8} horizontal>
                  <Button onClick={handleCancel} size={'small'}>
                    {'取消'}
                  </Button>
                  <Button loading={updating} onClick={handleFinish} size={'small'} type={'primary'}>
                    {'保存'}
                  </Button>
                </Flexbox>
              </Flexbox>
            </Form.Item>
          </Flexbox>
        )}
      </Form.List>
    </Form>
  );
});

export default KeyValueEditor;
