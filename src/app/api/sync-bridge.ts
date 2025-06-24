// 同步 API 桥接 - 临时空实现
export const syncApi = {
  enabledSync: () => Promise.resolve(),
  disableSync: () => Promise.resolve(),
};

export default syncApi;