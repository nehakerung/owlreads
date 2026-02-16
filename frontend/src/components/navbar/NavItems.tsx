import React from 'react';
import Log from '@/components/user/log';
import { cn } from '@/lib/utils';

interface Props {
  mobile?: boolean;
}

const NavItems = ({ mobile }: Props) => {
  return (
    <div
      className={cn(
        `flex items-center justify-center gap-6 ${
          mobile ? 'flex-col' : 'flex-row'
        }`
      )}
    >
      <Log />
    </div>
  );
};

export default NavItems;
