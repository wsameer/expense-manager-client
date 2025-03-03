import React from 'react';
import { cn } from '@/lib/utils';

export interface ListItemButtonProps
  extends React.LiHTMLAttributes<HTMLLIElement> {
  title: string;
  description?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  active?: boolean;
  onClickHandler?: React.MouseEventHandler<HTMLLIElement>;
}

export const ListItemButton = ({
  title,
  description,
  iconLeft,
  iconRight,
  active = false,
  className,
  onClickHandler,
  ...props
}: ListItemButtonProps) => {
  return (
    <li
      className={cn(
        'flex w-full items-center gap-2 rounded-xl p-3 transition-colors',
        'bg-white dark:bg-muted hover:bg-muted dark:hover:bg-background border',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'cursor-pointer',
        active && 'bg-muted',
        className,
      )}
      onClick={onClickHandler}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClickHandler?.(e as unknown as React.MouseEvent<HTMLLIElement>);
        }
      }}
      {...props}
    >
      {iconLeft && <div className="shrink-0">{iconLeft}</div>}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm">{title}</div>
        {description && (
          <div className="text-xs text-muted-foreground truncate">
            {description}
          </div>
        )}
      </div>
      {iconRight && <div className="shrink-0 ml-2">{iconRight}</div>}
    </li>
  );
};
