import { generate } from 'random-words';

import { createNanoId } from './uuid';

const prefixes = {
  agents: 'agt',
  documents: 'docs',
  files: 'file',
  generationBatches: 'gb',
  generationTopics: 'gt',
  generations: 'gen',
  knowledgeBases: 'kb',
  messages: 'msg',
  plugins: 'plg',
  sessionGroups: 'sg',
  sessions: 'ssn',
  threads: 'thd',
  topics: 'tpc',
  user: 'user',
} as const;

export const idGenerator = (namespace: keyof typeof prefixes, size = 12) => {
  const hash = createNanoId(size);
  const prefix = prefixes[namespace];

  if (!prefix) throw new Error(`Invalid namespace: ${namespace}, please check your code.`);

  return `${prefix}_${hash()}`;
};

// 专门为员工生成类似Clerk风格的ID
export const generateEmployeeId = () => {
  // 生成一个27位的随机字符串，类似 Clerk 的格式 user_2yK4sKFfa6XmNYCpnNkUXURuuIr
  const randomString = createNanoId(27)();
  return `user_${randomString}`;
};

// 生成内置员工账号
export const generateUserName = () => {
  // 生成一个8位的随机字符串，类似 Clerk 的格式 2yK4sKFf
  const randomString = createNanoId(8)();
  return `${randomString}`;
};

export const randomSlug = (count = 2) => (generate(count) as string[]).join('-');

export const inboxSessionId = (userId: string) => `ssn_inbox_${userId}`;
