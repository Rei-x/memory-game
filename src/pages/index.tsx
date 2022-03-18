import Head from 'next/head';
import { Container } from 'react-bootstrap';
import Layout from '@/components/Layout';
import Tournaments from '@/components/Tournaments';

export default function Home() {
  return (
    <Layout>
      <Container>
        <Head>
          <title>kajtekparty 🎉</title>
          <meta
            name="description"
            content="TypeScript starter for Next.js that includes all you need to build amazing apps"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Tournaments />
      </Container>
    </Layout>
  );
}
