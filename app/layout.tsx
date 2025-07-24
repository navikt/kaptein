import '@/app/globals.css';
import { Decorator } from '@/components/decorator';

interface Props {
  children: React.ReactNode;
}

const RootLayout = async ({ children }: Readonly<Props>) => {
  return <Decorator>{children}</Decorator>;
};

export default RootLayout;
