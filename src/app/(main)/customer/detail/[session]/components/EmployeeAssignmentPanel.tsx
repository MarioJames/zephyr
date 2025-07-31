import React from 'react';
import { CustomerAssignee } from '@/components/CustomerAssignee';
import { UserItem } from '@/services/user';
import { SessionItem } from '@/services/sessions';

export interface EmployeeAssignmentPanelProps {
  session: SessionItem;
  onAssignSuccess?: (employee: UserItem) => void;
}

export const EmployeeAssignmentPanel: React.FC<
  EmployeeAssignmentPanelProps
> = ({ session, onAssignSuccess }) => {
  return (
    <CustomerAssignee
      isTitle={true}
      onAssignSuccess={onAssignSuccess}
      placeholder='未分配'
      popoverPlacement='bottom'
      session={session}
      title='对接人'
    />
  );
};
