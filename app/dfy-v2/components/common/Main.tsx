import type { ReactNode } from 'react';

import SiteFooter from '@/components/SiteFooter';

import { cn } from '@/app/dfy-v2/_lib/cn';

interface MainProps {
  className?: string;
  children: ReactNode;
  isShowFooter?: boolean;
  footerClass?: string;
}

const MainWrapper: React.FC<MainProps> = ({
  className,
  children,
  isShowFooter = true,
}) => {
  return (
    <div className={cn('h-full w-full', className)}>
      <main>{children}</main>
      {isShowFooter && <SiteFooter />}
    </div>
  );
};

export default MainWrapper;
