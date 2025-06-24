// 统一导出所有API模块
export { default as userAPI } from './user';
export { default as rolesAPI } from './roles';
export { default as agentsAPI } from './agents';
export { default as sessionsAPI } from './sessions';
export { default as sessionGroupsAPI } from './session-groups';
export { default as topicsAPI } from './topics';
export { default as messagesAPI } from './messages';
export { default as messageTranslatesAPI } from './message_translates';
export { default as chatAPI } from './chat';
export { default as filesAPI } from './files';
export { default as customersAPI } from './customers';

// 导出类型定义
export type {
  UserItem,
  UserCreateRequest,
  UserUpdateRequest,
} from './user';

export type {
  RoleItem,
} from './roles';

export type {
  AgentItem,
  CreateAgentRequest,
  UpdateAgentRequest,
  AgentDetailResponse,
} from './agents';

export type {
  SessionItem,
  SessionListRequest,
  SessionCreateRequest,
  SessionUpdateRequest,
  SessionSearchRequest,
  SessionCloneRequest,
} from './sessions';

export type {
  SessionGroupItem,
  SessionGroupCreateRequest,
  SessionGroupUpdateRequest,
  SessionGroupOrderRequest,
} from './session-groups';

export type {
  TopicItem,
  TopicListRequest,
  TopicCreateRequest,
  TopicSummaryRequest,
} from './topics';

export type {
  MessageItem,
  MessagesQueryByTopicRequest,
  MessagesCreateRequest,
  MessageCountByTopicsRequest,
  MessageCountByUserRequest,
  MessageCountResponse,
} from './messages';

export type {
  MessageTranslateItem,
  MessageTranslateQueryRequest,
  MessageTranslateTriggerRequest,
} from './message_translates';

export type {
  ChatMessage,
  ChatRequest,
  ChatResponse,
  TranslateRequest,
  GenerateReplyRequest,
} from './chat';

export type {
  FileMetadata,
  FileUploadResponse,
  FileUploadRequest,
  BatchUploadRequest,
  BatchUploadResponse,
  FileListRequest,
  FileListResponse,
} from './files';

export type {
  CustomerSessionItem,
  CustomerDetailItem,
  CustomerListRequest,
  CustomerListResponse,
  CustomerCreateRequest,
  CustomerUpdateRequest,
  CustomerSearchRequest,
  CustomerStatsResponse,
  BatchUpdateTypeRequest,
} from './customers';
