import React, { useState } from 'react';
import { Typography, Upload, App, Form } from 'antd';
import { Button,Input } from '@lobehub/ui';
import { UploadOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { AvatarUploaderProps } from '../shared/types';
import { useAvatarUploaderStyles } from './styles';
import filesService from '@/services/files';
import { isValidImageUrl } from '@/utils/avatar';

const { Title } = Typography;

export default function AvatarUploader({
  disabled = false,
}: AvatarUploaderProps) {
  const { styles } = useAvatarUploaderStyles();
  const { message } = App.useApp();

  const form = Form.useFormInstance();

  const avatarUrl = Form.useWatch('avatar', form);

  const [uploading, setUploading] = useState(false);

  // 处理头像上传
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCustomRequest = async ({ file, onSuccess, onError }: any) => {
    try {
      setUploading(true);

      // 调用文件上传服务
      const response = await filesService.uploadPublic({
        file: file as File,
        directory: 'avatars',
        skipCheckFileType: false,
      });

      // 更新头像URL
      form.setFieldValue('avatar', response.url);

      // 通知上传成功
      onSuccess?.(response);
      message.success('头像上传成功！');
    } catch (error) {
      console.error('头像上传失败:', error);
      onError?.(error);
      message.error('头像上传失败，请重试');
    } finally {
      setUploading(false);
    }
  };

  // 文件上传前的验证
  const beforeUpload = (file: File) => {
    // 验证文件类型
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('只能上传图片文件！');
      return false;
    }

    // 验证文件大小（限制为 5MB）
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('图片大小不能超过 5MB！');
      return false;
    }

    return true;
  };

  return (
    <>
      <Title level={5}>头像</Title>
      <Form.Item name='avatar' hidden>
        <Input />
      </Form.Item>
      <div className={styles.avatarContainer}>
        <div className={styles.avatarCircle}>
          {avatarUrl ? (
            isValidImageUrl(avatarUrl) ? (
              <Image
                src={avatarUrl}
                alt='avatar'
                width={80}
                height={80}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <div
                style={{
                  color: '#333',
                  fontSize: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%',
                }}
              >
                {avatarUrl}
              </div>
            )
          ) : (
            <div style={{ color: '#999' }}>头像</div>
          )}
        </div>
        <Upload
          showUploadList={false}
          beforeUpload={beforeUpload}
          customRequest={handleCustomRequest}
          disabled={disabled || uploading}
        >
          <Button
            icon={<UploadOutlined />}
            loading={uploading}
            disabled={disabled || uploading}
          >
            {uploading ? '上传中...' : '上传头像'}
          </Button>
        </Upload>
      </div>
    </>
  );
}
