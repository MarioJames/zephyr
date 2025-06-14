import { createGlobalStyle } from 'antd-style';

import antdOverride from './antdOverride';
import global from './global';
import reset from './reset';

const prefixCls = 'ant';

export const GlobalStyle = createGlobalStyle(({ theme }) => [
  reset(),
  global({ prefixCls, token: theme }),
  antdOverride({ prefixCls, token: theme }),
]);

export * from './text';
