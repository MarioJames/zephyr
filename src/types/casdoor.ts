/**
 * Casdoor 类型定义
 */

// Casdoor 用户接口定义
export interface CasdoorUser {
  owner: string;
  name: string;
  createdTime?: string;
  updatedTime?: string;
  id?: string;
  type?: string;
  password?: string;
  passwordSalt?: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  permanentAvatar?: string;
  email?: string;
  emailVerified?: boolean;
  phone?: string;
  location?: string;
  address?: string[];
  affiliation?: string;
  title?: string;
  idCardType?: string;
  idCard?: string;
  homepage?: string;
  bio?: string;
  tag?: string;
  region?: string;
  language?: string;
  gender?: string;
  birthday?: string;
  education?: string;
  score?: number;
  karma?: number;
  ranking?: number;
  isDefaultAvatar?: boolean;
  isOnline?: boolean;
  isAdmin?: boolean;
  isForbidden?: boolean;
  isDeleted?: boolean;
  signupApplication?: string;
  hash?: string;
  preHash?: string;
  createdIp?: string;
  lastSigninTime?: string;
  lastSigninIp?: string;
  github?: string;
  google?: string;
  qq?: string;
  wechat?: string;
  facebook?: string;
  dingtalk?: string;
  weibo?: string;
  gitee?: string;
  linkedin?: string;
  wecom?: string;
  lark?: string;
  gitlab?: string;
  adfs?: string;
  baidu?: string;
  alipay?: string;
  casdoor?: string;
  infoflow?: string;
  apple?: string;
  azuread?: string;
  slack?: string;
  steam?: string;
  bilibili?: string;
  okta?: string;
  douyin?: string;
  line?: string;
  amazon?: string;
  auth0?: string;
  battlenet?: string;
  bitbucket?: string;
  box?: string;
  cloudfoundry?: string;
  dailymotion?: string;
  deezer?: string;
  digitalocean?: string;
  discord?: string;
  dropbox?: string;
  eveonline?: string;
  fitbit?: string;
  gitea?: string;
  heroku?: string;
  influxcloud?: string;
  instagram?: string;
  intercom?: string;
  kakao?: string;
  lastfm?: string;
  mailru?: string;
  meetup?: string;
  microsoftonline?: string;
  naver?: string;
  nextcloud?: string;
  onedrive?: string;
  oura?: string;
  patreon?: string;
  paypal?: string;
  salesforce?: string;
  shopify?: string;
  soundcloud?: string;
  spotify?: string;
  strava?: string;
  stripe?: string;
  tumblr?: string;
  twitch?: string;
  twitter?: string;
  typetalk?: string;
  uber?: string;
  vk?: string;
  wepay?: string;
  xero?: string;
  yahoo?: string;
  yammer?: string;
  yandex?: string;
  zoom?: string;
  metamask?: string;
  web3onboard?: string;
  properties?: Record<string, string>;
}

// Casdoor SDK 配置
export interface CasdoorConfig {
  endpoint: string;
  clientId: string;
  clientSecret: string;
  certificate: string;
  organizationName: string;
  applicationName: string;
}

// API 响应接口
export interface CasdoorResponse<T = any> {
  status: string;
  msg: string;
  data: T;
}

// 用户创建参数类型
export type CreateCasdoorUserParams = Partial<CasdoorUser> & {
  name: string; // name 是必需的
};

// 用户更新参数类型
export type UpdateCasdoorUserParams = CasdoorUser;

// 批量用户创建参数类型
export type BatchCreateCasdoorUsersParams = CreateCasdoorUserParams[];

// 用户状态设置参数
export interface SetUserStatusParams {
  userName: string;
  isForbidden: boolean;
}

// 用户密码更新参数
export interface UpdateUserPasswordParams {
  userName: string;
  newPassword: string;
}

// 修改密码请求参数
export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  userInfo?: {
    name?: string;
    email?: string;
    id?: string;
  };
}

// 修改密码响应
export interface ChangePasswordResponse {
  success: boolean;
  message: string;
  error?: string;
}