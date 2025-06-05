import { LobeBuiltinTool } from '@/types/tool';

import { DalleManifest } from './dalle';
import { WebBrowsingManifest } from './web-browsing';

export const builtinTools: LobeBuiltinTool[] = [
  {
    identifier: DalleManifest.identifier,
    manifest: DalleManifest,
    type: 'builtin',
  },
  {
    hidden: true,
    identifier: WebBrowsingManifest.identifier,
    manifest: WebBrowsingManifest,
    type: 'builtin',
  },
];
