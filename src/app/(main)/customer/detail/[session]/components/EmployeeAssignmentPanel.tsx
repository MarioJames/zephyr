import React from 'react';
import { CustomerAssignee } from '@/components/CustomerAssignee';
import { UserItem } from '@/services/user';
import { SessionItem } from '@/services/sessions';

export interface EmployeeAssignmentPanelProps {
  session: SessionItem;
  onAssignSuccess?: (employee: UserItem) => void;
  onAssignError?: (error: any) => void;
}

export const EmployeeAssignmentPanel: React.FC<
  EmployeeAssignmentPanelProps
> = ({ session, onAssignSuccess, onAssignError }) => {
  return (
    <CustomerAssignee
      session={session}
      title="对接人"
      placeholder="未分配"
      popoverPlacement="bottom"
      onAssignSuccess={onAssignSuccess}
      onAssignError={onAssignError}
    />
  );
};
