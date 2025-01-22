import Navbar from '@/components/navbar/navbar';
import { CheckUserEmailProvider } from '@/jotai/check-user-email-provider';

const HomeLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <CheckUserEmailProvider>
      <div>
        <div className='grid min-h-dvh grid-rows-[auto_1fr]'>
          <Navbar />
          <main>{children}</main>
        </div>
      </div>
    </CheckUserEmailProvider>
  );
};

export default HomeLayout;
