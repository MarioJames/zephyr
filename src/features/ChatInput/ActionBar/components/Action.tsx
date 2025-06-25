'use client';

import { ActionIcon, type ActionIconProps } from '@lobehub/ui';
import { isUndefined } from 'lodash-es';
import { memo } from 'react';
import useMergeState from 'use-merge-value';

import ActionDropdown, { ActionDropdownProps } from './ActionDropdown';
import ActionPopover, { ActionPopoverProps } from './ActionPopover';

interface ActionProps extends Omit<ActionIconProps, 'popover'> {
  dropdown?: ActionDropdownProps;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  popover?: ActionPopoverProps;
  showTooltip?: boolean;
  trigger?: ActionDropdownProps['trigger'];
}

const Action = memo<ActionProps>(
  ({
    showTooltip,
    loading,
    icon,
    title,
    dropdown,
    popover,
    open,
    onOpenChange,
    trigger,
    disabled,
    ...rest
  }) => {
    const [show, setShow] = useMergeState(false, {
      onChange: onOpenChange,
      value: open,
    });
    const iconNode = (
      <ActionIcon
        disabled={disabled}
        icon={icon}
        loading={loading}
        onClick={() => setShow(true)}
        title={
          isUndefined(showTooltip) ? ( title) : showTooltip ? title : undefined
        }
        tooltipProps={{
          placement: 'bottom',
        }}
        {...rest}
      />
    );

    if (disabled) return iconNode;

    if (dropdown)
      return (
        <ActionDropdown
          onOpenChange={setShow}
          open={show}
          trigger={trigger}
          {...dropdown}
          minWidth={dropdown.minWidth}
          placement={dropdown.placement}
        >
          {iconNode}
        </ActionDropdown>
      );
    if (popover)
      return (
        <ActionPopover
          onOpenChange={setShow}
          open={show}
          trigger={trigger}
          {...popover}
          minWidth={popover.minWidth}
          placement={popover.placement}
        >
          {iconNode}
        </ActionPopover>
      );

    return iconNode;
  },
);

export default Action;
