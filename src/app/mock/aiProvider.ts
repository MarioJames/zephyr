export default {
  '/aiProvider/createAiProvider': () => ({ id: 'mock-provider-id', success: true }),
  '/aiProvider/deleteAiProvider': () => ({ success: true }),
  '/aiProvider/getAiProviderById': () => ({
    id: 'mock-provider-id',
    name: 'Mock Provider',
    enabled: true,
    source: 'custom',
    config: {},
    models: [],
  }),
  '/aiProvider/getAiProviderList': () => [
    { id: 'openai', name: 'OpenAI', enabled: true, source: 'builtin' },
    { id: 'mock-provider-id', name: 'Mock Provider', enabled: true, source: 'custom' },
  ],
  '/aiProvider/getAiProviderRuntimeState': () => ({
    enabledAiModels: [
      {
        id: 'gpt-4',
        displayName: 'GPT-4',
        enabled: true,
        providerId: 'openai',
        type: 'chat',
        abilities: { functionCall: true, reasoning: true, vision: false },
        pricing: { input: 0.03, output: 0.06, currency: 'USD' },
        source: 'remote',
      },
    ],
    enabledAiProviders: [
      { id: 'openai', name: 'OpenAI', source: 'builtin' },
      { id: 'mock-provider-id', name: 'Mock Provider', source: 'custom' },
    ],
    runtimeConfig: {},
  }),
  '/aiProvider/toggleProviderEnabled': () => ({ success: true }),
  '/aiProvider/updateAiProvider': () => ({ success: true }),
  '/aiProvider/updateAiProviderConfig': () => ({ success: true }),
  '/aiProvider/updateAiProviderOrder': () => ({ success: true }),
}; 