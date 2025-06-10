export default {
  '/models/getModels': ({ provider }) => [
    { id: 'gpt-4', name: 'GPT-4', provider: provider || 'openai', type: 'chat', contextWindow: 128000, enabled: true },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: provider || 'openai', type: 'chat', contextWindow: 16384, enabled: true },
    { id: 'embedding-ada', name: 'Ada Embedding', provider: provider || 'openai', type: 'embedding', contextWindow: 8192, enabled: false },
  ],
}; 