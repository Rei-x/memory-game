import { AppProps } from 'next/app';
import { RecoilRoot } from 'recoil';
import '@/styles/global.scss';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <Component {...pageProps} />
    </RecoilRoot>
  );
}
