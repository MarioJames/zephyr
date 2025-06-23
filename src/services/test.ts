// 测试文件 - 验证所有API接口的类型定义
import {
  userAPI,
  rolesAPI,
  agentsAPI,
  sessionsAPI,
  topicsAPI,
  messagesAPI,
  messageTranslatesAPI,
  type UserItem,
  type RoleItem,
  type AgentItem,
  type SessionItem,
  type TopicItem,
  type MessageItem,
  type MessageTranslateItem,
  type CreateAgentRequest,
  type SessionListRequest,
  type SessionCreateRequest,
  type TopicListRequest,
  type TopicCreateRequest,
  type MessagesQueryByTopicRequest,
  type MessagesCreateRequest,
  type MessageTranslateQueryRequest,
  type MessageTranslateTriggerRequest,
} from './index';

// 测试函数 - 验证所有接口的类型定义
export async function testAllAPIs() {
  try {
    // 用户相关接口测试
    const userInfo: UserItem = await userAPI.getUserInfo();
    const userList: UserItem[] = await userAPI.getUserList();

    // 角色相关接口测试
    const roleList: RoleItem[] = await rolesAPI.getRoleList();

    // 智能体相关接口测试
    const agentList: AgentItem[] = await agentsAPI.getAgentList();
    
    const createAgentData: CreateAgentRequest = {
      title: "测试智能体",
      description: "这是一个测试智能体",
      model: "gpt-3.5-turbo",
      provider: "openai"
    };
    const newAgent: AgentItem = await agentsAPI.createAgent(createAgentData);

    // 会话相关接口测试
    const sessionListParams: SessionListRequest = { userId: "user123" };
    const sessionList: SessionItem[] = await sessionsAPI.getSessionList(sessionListParams);
    
    const createSessionData: SessionCreateRequest = {
      config: createAgentData,
      session: {
        title: "测试客户",
        model: "gpt-3.5-turbo",
        type: "agent"
      }
    };
    const newSession: SessionItem = await sessionsAPI.createSession(createSessionData);
    const updatedSession: SessionItem = await sessionsAPI.updateSession(createSessionData);

    // 话题相关接口测试
    const topicListParams: TopicListRequest = { sessionId: "session123" };
    const topicList: TopicItem[] = await topicsAPI.getTopicList(topicListParams);
    
    const createTopicData: TopicCreateRequest = {
      sessionId: "session123",
      title: "测试话题"
    };
    const newTopic: TopicItem = await topicsAPI.createTopic(createTopicData);
    const summaryTopic: TopicItem = await topicsAPI.summaryTopic("topic123");

    // 消息相关接口测试
    const messageQueryParams: MessagesQueryByTopicRequest = { topicId: "topic123" };
    const messageList: MessageItem[] = await messagesAPI.queryByTopic(messageQueryParams);
    
    const createMessageData: MessagesCreateRequest = {
      content: "测试消息",
      role: "assistant",
      sessionId: "session123",
      topic: "topic123",
      fromModel: "gpt-3.5-turbo",
      fromProvider: "openai"
    };
    const messageId: string = await messagesAPI.createMessage(createMessageData);

    // 翻译相关接口测试
    const translateQueryParams: MessageTranslateQueryRequest = { messageId: "message123" };
    const translate: MessageTranslateItem = await messageTranslatesAPI.queryTranslate(translateQueryParams);
    
    const triggerTranslateData: MessageTranslateTriggerRequest = {
      messageId: "message123",
      from: "zh",
      to: "en"
    };
    await messageTranslatesAPI.triggerTranslate(triggerTranslateData);

    console.log("所有API接口类型定义验证通过！");
    return {
      userInfo,
      userList,
      roleList,
      agentList,
      newAgent,
      sessionList,
      newSession,
      updatedSession,
      topicList,
      newTopic,
      summaryTopic,
      messageList,
      messageId,
      translate
    };
  } catch (error) {
    console.error("API接口类型定义验证失败:", error);
    throw error;
  }
}

// 导出测试函数
export default testAllAPIs; 