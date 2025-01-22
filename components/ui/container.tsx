import { cn } from '@/lib/utils';

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  isFullHeight?: boolean;
  isFlex?: boolean;
  defaultPY?: boolean;
};

const Container = ({
  children,
  className,
  isFullHeight = false,
  isFlex = false,
  defaultPY = false,
}: ContainerProps) => {
  return (
    <section>
      <div
        className={cn('mx-auto max-w-7xl px-5 lg:px-3', className, {
          'h-full': isFullHeight,
          'py-4': defaultPY,
          flex: isFlex,
        })}>
        {children}
      </div>
    </section>
  );
};

export default Container;
