// 跟踪 API 桥接 - 临时空实现（因为 traces 功能已删除）

export const traceApi = {
  traceEvent: () => Promise.resolve(),
  createTrace: () => Promise.resolve(''),
  updateTrace: () => Promise.resolve(),
  deleteTrace: () => Promise.resolve(),
  getTrace: () => Promise.resolve({}),
};

export default traceApi;