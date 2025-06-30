import { Modal, Button, Typography } from 'antd';
import { MessageOutlined, UserOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Text } = Typography;

interface ChatConfirmModalProps {
  visible: boolean;
  onCancel: () => void;
  sessionId: string;
  topicId: string;
  username: string;
}

export const ChatConfirmModal: React.FC<ChatConfirmModalProps> = ({
  visible,
  onCancel,
  sessionId,
  topicId,
  username,
}) => {
  const router = useRouter();

  const handleStartChat = () => {
    const chatUrl = `/chat?session=${sessionId}&topic=${topicId}`;
    router.push(chatUrl);
    onCancel();
  };

  return (
    <Modal
      title={<><MessageOutlined /> 开始对话</>}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          稍后再说
        </Button>,
        <Button key="chat" type="primary" onClick={handleStartChat} icon={<MessageOutlined />}>
          立即对话
        </Button>,
      ]}
      width={400}
      centered
    >
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <UserOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
        <Text strong style={{ display: 'block', marginBottom: '8px' }}>
          用户 {username} 创建成功！
        </Text>
        <Text type="secondary">
          已为该用户创建了默认对话主题，是否立即开始对话？
        </Text>
      </div>
    </Modal>
  );
};