import Head from 'next/head';
import { Container } from 'react-bootstrap';
import Layout from '@/components/Layout';
import Tournaments from '@/components/Tournaments';

export default function Home() {
  return (
    <Layout>
      <Container>
        <Tournaments />
      </Container>
    </Layout>
  );
}
