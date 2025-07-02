import { CustomerSessionItem } from '@/database/schemas';
import { AgentConfig } from './agent';

export interface CustomerExtend
  extends Omit<CustomerSessionItem, 'chatConfig'> {
  chatConfig: AgentConfig;
}
