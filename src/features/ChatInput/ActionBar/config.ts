import { MainToken } from './Token';
import Search from './Search';
import Upload from './Upload';
import Stt from './STT';
import NewTopic from './NewTopic';
import History from './History';

export const actionMap = {
  fileUpload: Upload,
  search: Search,
  mainToken: MainToken,
  stt: Stt,
  newTopic: NewTopic,
  history: History,
} as const;

export type ActionKeys = keyof typeof actionMap;
