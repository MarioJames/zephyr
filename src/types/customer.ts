import { CustomerSessionItem } from '@/database';
import { AgentConfig } from './agent';

export interface CustomerExtend
  extends Omit<CustomerSessionItem, 'chatConfig'> {
  chatConfig: AgentConfig;
}
