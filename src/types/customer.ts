import type { CustomerSessionItem } from '@/database';
import { AgentConfig } from './agent';

export interface CustomerExtend
  extends Omit<CustomerSessionItem, 'chatConfig' | 'maritalStatus'> {
  maritalStatus: 'Married' | 'Unmarried' | null;
  chatConfig: AgentConfig;
}
