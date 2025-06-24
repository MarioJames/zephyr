// 定义加载状态类型
export enum DatabaseLoadingState {
  Error = 'error',
  Finished = 'finished',
  Idle = 'idle',
  Initializing = 'initializing',
  LoadingDependencies = 'loadingDependencies',
  LoadingWasm = 'loadingWasm',
  Migrating = 'migrating',
  Ready = 'ready',
}

export interface MigrationSQL {
  bps: boolean;
  folderMillis: number;
  hash: string;
  sql: string[];
}

export interface MigrationTableItem {
  created_at: number;
  hash: string;
  id: number;
}
