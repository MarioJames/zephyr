// 统一导出所有API模块
export { default as agentsAPI } from './agents';
export { default as chatAPI } from './chat';
export { default as customerAPI } from './customer';
export { default as filesAPI } from './files';
export { default as mailAPI } from './mail';
export { default as messageTranslatesAPI } from './message_translates';
export { default as messagesAPI } from './messages';
export { default as modelsAPI } from './models';
export { default as rolesAPI } from './roles';
export { default as sessionsAPI } from './sessions';
export { default as topicsAPI } from './topics';
export { default as userAPI } from './user';

// 导出类型定义
export type {
  AgentDetailResponse,
  AgentItem,
  CreateAgentRequest,
  UpdateAgentRequest,
} from './agents';
export type {
  ChatMessage,
  ChatRequest,
  ChatResponse,
  GenerateReplyRequest,
  TranslateRequest,
} from './chat';
export type {
  CustomerCreateRequest,
  CustomerItem,
  CustomerListRequest,
  CustomerListResponse,
  CustomerUpdateRequest,
} from './customer';
export type {
  BatchUploadRequest,
  BatchUploadResponse,
  FileListRequest,
  FileListResponse,
  FileMetadata,
  FileUploadRequest,
} from './files';
export type {
  MessageTranslateItem,
  MessageTranslateQueryRequest,
  MessageTranslateTriggerRequest,
} from './message_translates';
export type {
  MessageCountByTopicsRequest,
  MessageCountByUserRequest,
  MessageCountResponse,
  MessageItem,
  MessagesCreateRequest,
  MessagesQueryByTopicRequest,
} from './messages';
export type { RoleItem } from './roles';
export type {
  SessionCreateRequest,
  SessionItem,
  SessionListRequest,
  SessionSearchRequest,
  SessionUpdateRequest,
} from './sessions';
export type {
  TopicCreateRequest,
  TopicItem,
  TopicTitleSummaryRequest,
  TopicUpdateRequest,
} from './topics';
export type { UserCreateRequest, UserItem, UserUpdateRequest } from './user';
