# Store 模块问题与修复建议（审计记录）

本文记录对 `src/store` 目录的批量阅读中发现的问题与可落地的修复方案，便于后续实施与追踪。

## 1) Map 原地修改未触发订阅更新（高优先级）
- 位置: `src/store/chat/slices/upload/action.ts`
- 问题: 直接对 `parsedFileContentMap` 执行 `delete`，但未通过 `set` 设置新引用，Zustand 订阅者无法感知变更。
- 影响: UI 不刷新或状态不同步。
- 修复方案: 克隆 Map 后再 `set` 新引用；或改为 immer。
- 代码示例:
```ts
// before
clearParsedFileContent: (fileId: string) => {
  const parsedFileContentMap = get().parsedFileContentMap;
  parsedFileContentMap.delete(fileId);
},

// after
clearParsedFileContent: (fileId: string) => {
  const next = new Map(get().parsedFileContentMap);
  next.delete(fileId);
  set({ parsedFileContentMap: next });
},
```

## 2) Chat 错误状态混用（高优先级）
- 位置: `ChatState`（合并了建议、消息等模块），`suggestionsSelectors.suggestionsError` 读取的是 `s.error`。
- 问题: 不同子域的错误共享一个字段，易相互覆盖，导致 UI 显示混乱。
- 修复方案: 拆分错误域。例如：`messageError/topicError/suggestionsError/uploadError`；各 slice 只更新自身错误；selectors 指向各自错误。
- 代码示例:
```ts
// ChatState
export interface ChatState {
  // ...
  messageError?: string;
  topicError?: string;
  suggestionsError?: string;
  uploadError?: string;
}

// suggestions slice 设置错误时：
set({ suggestionsError: errorMessage });

// selectors:
export const suggestionsSelectors = {
  suggestionsError: (s: ChatState) => s.suggestionsError,
};
```

## 3) Dock 上传串行且频繁 set（中高优先级）
- 位置: `src/store/file/slices/core/action.ts::pushDockFileList`
- 问题: for-of 串行 await；每步多次 set；文件多时性能差且渲染频繁。
- 修复方案: 使用有限并发（如并发=3）+ 批量合并 `set`。避免每个文件多次 `set`。
- 代码示例（无外部依赖的简单并发）：
```ts
const CONCURRENCY = 3;
const tasks = files.map((file, i) => async () => {
  // ...调用 batchUpload 并构造结果
});
for (let i = 0; i < tasks.length; i += CONCURRENCY) {
  const slice = tasks.slice(i, i + CONCURRENCY);
  const results = await Promise.allSettled(slice.map(fn => fn()));
  // 仅在这一批结束后合并更新一次 dockFileList
  set({ dockFileList: mergeBatchResults(get().dockFileList, results) });
}
```

## 4) 员工搜索并发去重键不完整（中优先级）
- 位置: `src/store/employee/slices/search/action.ts`
- 问题: `pendingSearchKeys` 使用 `keyword:pageSize`，无法区分不同页码并发；易误判已有请求。
- 修复方案: 将页码纳入 key，或将分页作为独立去重维度。
- 代码示例:
```ts
const pageToRequest = reset ? 1 : currentPage + 1;
const searchKey = `${keyword || ''}:${pageSize}:${pageToRequest}`;
```

## 5) 类型不严谨：aggregatedModels 使用 any[]（中优先级）
- 位置: `src/store/agent/slices/core/initialState.ts`
- 问题: `aggregatedModels: any[]`；而实际来自 `AggregatedModelItem`。
- 修复方案: 改为强类型，提升类型安全与可读性。
- 代码示例:
```ts
import { AggregatedModelItem } from '@/services/models';
export interface AgentCoreState {
  // ...
  aggregatedModels: AggregatedModelItem[];
}
export const initialAgentCoreState: AgentCoreState = {
  aggregatedModels: [],
  // ...
};
```

## 6) 会话迁移仅取 100 条未分页（中优先级）
- 位置: `src/store/agent/slices/core/action.ts::transferSessionsToAgent`
- 问题: 仅拉取 `pageSize: 100`；超过 100 条会话会遗漏迁移。
- 修复方案: 分页拉满，或服务端新增批量迁移接口；就地修复建议分页循环至返回条数 < pageSize。
- 代码示例:
```ts
const pageSize = 100;
let page = 1;
const ids: string[] = [];
while (true) {
  const res = await sessionsService.getSessionList({ agentId: fromAgentId, page, pageSize });
  ids.push(...res.sessions.map((s: SessionItem) => s.id));
  if (!res.sessions.length || res.sessions.length < pageSize) break;
  page += 1;
}
// 然后 batchUpdateSessions(ids.map(id => ({ id, agentId: toAgentId })))
```

## 7) 跨 store 强耦合与风格不一（中优先级）
- 位置: 多处直接 `useOtherStore.getState()` + `setState`（如 Session 重置 Chat）。
- 问题: 增加隐式依赖与维护成本；统一性差。
- 修复方案: 为跨域操作增加门面 action，例如 Chat 暴露 `resetState()`；Session 仅调用该 action，不直接 set 其内部字段。
- 代码示例:
```ts
// chat/store.ts
export const chatCoreSlice = (set) => ({
  resetState: () => set({ /* 集中清空字段 */ }),
});
// session/switchSession 内：
useChatStore.getState().resetState();
```

## 8) Selector 计算未 memo，返回新数组导致重渲染（中优先级）
- 位置: `suggestionsSortedByTime`、`mainAIChatsWithHistoryConfig`（内部切片与排序）。
- 问题: 每次选择器返回新引用，浅比较失效，导致组件重渲染。
- 修复方案: 使用 `proxy-memoize` 或 `reselect` 风格 memo，对依赖稳定时复用结果。
- 代码示例:
```ts
import memoize from 'proxy-memoize';
export const suggestionsSortedByTime = memoize((s: ChatStore) =>
  [...s.suggestions].sort((a, b) => +new Date(b.createdAt!) - +new Date(a.createdAt!))
);
```

## 9) Store 构建样板重复（中优先级）
- 位置: 各 `store.ts` 中 `createWithEqualityFn + subscribeWithSelector + devtools` 重复。
- 修复方案: 在 `utils/store` 增加 `createStoreFactory(name, initial, ...slices)` 封装；后续逐步迁移，降低重复代码与出错率。
- 代码示例:
```ts
// utils/store-factory.ts
export const createStoreFactory = (name) => (createStore) =>
  createWithEqualityFn(subscribeWithSelector(createDevtools(name)(createStore)), shallow);

// 使用
export const useChatStore = createStoreFactory('chat')(() => ({ ...slices }))
```

## 10) SSR 安全性：直接访问 window/url（低优先级）
- 位置: `session/active/action.ts`、`customer/category/action.ts`、`utils/store.ts`。
- 问题: 若在 SSR 调用路径中触发，可能抛错。
- 修复方案: 增加 `typeof window !== 'undefined'` 守卫；或仅在客户端生命周期内调用。
- 代码示例:
```ts
if (typeof window !== 'undefined') {
  const params = new URLSearchParams(window.location.search);
  // ...
}
```

## 11) 命名与未使用参数（低优先级）
- 问题1: `useFetchFileManage` 并非 React Hook；建议更名为 `fetchFileList`（涉及调用点同步重命名）。
- 问题2: `updateSystemStatus(_: Partial<SystemStatus>, action?: any)` 的 `action` 参数未使用；应删除或改成受控调试标记类型。
- 修复方案: 统一命名与参数清理，减少误导与技术债。

---

## 建议落地顺序（供排期参考）
1) Map 更新可观察性修复（1-2 处，最小改动即收益）
2) Chat 错误域拆分 + 选择器调整（影响 UI 正确性）
3) Dock 上传并发与批量 set（性能提升明显）
4) 搜索并发键修复 + 类型完善（稳健性）
5) 会话迁移分页（正确性）
6) 跨 store 门面 action、memo 选择器、样板工厂化（工程质量）
7) SSR 守卫、命名与参数清理（扫尾）

## 备注
- 本文仅记录设计与修复建议，未对代码做改动。如需我按以上顺序提交改造 PR，可从第 1、2 项开始，小步快跑、逐步验证。

