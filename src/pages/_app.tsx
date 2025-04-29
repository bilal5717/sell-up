// _app.tsx
import 'bootstrap/dist/css/bootstrap.min.css';
import type { AppProps } from 'next/app';
import type { NextPage } from 'next';
import MainLayout from '@/Layout/MainLayout';
import PlainLayout from '@/Layout/PlainLayout';
import '@styles/globals.css';
type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => <MainLayout>{page}</MainLayout>);
  return getLayout(<Component {...pageProps} />);
}

export default MyApp;
