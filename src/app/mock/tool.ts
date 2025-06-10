export default {
  '/tool/getToolManifest': (data) => ({ identifier: data?.manifest || 'mock-tool', meta: { name: 'Mock Tool', desc: 'A mock tool for testing.' }, version: '1.0.0' }),
  '/tool/getToolList': () => ([
    { identifier: 'mock-tool-1', meta: { name: 'Mock Tool 1', desc: 'First mock tool.' }, version: '1.0.0' },
    { identifier: 'mock-tool-2', meta: { name: 'Mock Tool 2', desc: 'Second mock tool.' }, version: '1.0.0' },
  ]),
}; 