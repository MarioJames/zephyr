export default {
  '/search/search': ({ query }) => ({
    results: [
      {
        title: `Result for ${query}`,
        url: 'https://example.com/1',
        content: 'This is a mock search result content.',
        publishedDate: '2024-01-01',
        imgSrc: '',
        thumbnail: '',
      },
    ],
  }),
  '/search/crawlPage': ({ url }) => ({
    results: [
      {
        data: {
          url,
          content: 'Mock crawled page content',
        },
      },
    ],
  }),
  '/search/crawlPages': ({ urls }) => ({
    results: urls.map((url: string) => ({
      data: {
        url,
        content: 'Mock crawled page content',
      },
    })),
  }),
}; 