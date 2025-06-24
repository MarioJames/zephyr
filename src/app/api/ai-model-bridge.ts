// AI 模型 API 桥接 - 临时空实现
export const aiModelApi = {
  getModels: () => Promise.resolve([]),
  createModel: () => Promise.resolve(''),
  updateModel: () => Promise.resolve(),
  deleteModel: () => Promise.resolve(),
  batchToggleAiModels: () => Promise.resolve(),
  batchUpdateAiModels: () => Promise.resolve(),
  clearModelsByProvider: () => Promise.resolve(),
  clearRemoteModels: () => Promise.resolve(),
};

export default aiModelApi;