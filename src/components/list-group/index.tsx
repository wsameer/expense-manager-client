import React from 'react';

type Props = {
  title: string;
  children: React.ReactNode;
  rightSideElement?: React.ReactNode;
};

export const ListGroup = React.memo<Props>(
  ({ title, rightSideElement, children }) => {
    return (
      <div>
        <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">
          <div className="flex justify-between">
            <p className="text-small">{title}</p>
            {rightSideElement}
          </div>
        </h2>
        <div className="bg-white border dark:bg-zinc-800 rounded-xl overflow-hidden">
          {children}
        </div>
      </div>
    );
  },
);

ListGroup.displayName = 'ListGroup';
