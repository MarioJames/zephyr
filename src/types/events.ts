export type MessageEvent = {
  type: 'error' | 'success' | 'warning' | 'info';
  message: string;
};
