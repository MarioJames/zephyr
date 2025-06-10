export default {
  '/file/upload': (data) => ({ fileId: 'mock-file-id', fileName: data?.name || 'mock.txt', url: '/mock/file/url' }),
  '/file/delete': (data) => ({ fileId: data?.fileId || 'mock-file-id', success: true }),
  '/file/list': (data) => ([
    { fileId: 'mock-file-id', fileName: 'mock.txt', url: '/mock/file/url', size: 12345, uploadedAt: Date.now() },
  ]),
}; 