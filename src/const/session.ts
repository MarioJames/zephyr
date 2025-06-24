import qs from 'query-string';

export const INBOX_SESSION_ID = 'inbox';

export const SESSION_CHAT_URL = (id: string = INBOX_SESSION_ID) =>
  qs.stringifyUrl({
    query: { session: id },
    url: '/chat',
  });
