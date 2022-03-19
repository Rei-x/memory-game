import { Container } from 'react-bootstrap';
import Layout from '@/components/Layout';
import Tournaments from '@/components/Tournaments';

export default function Home() {
  return (
    <Layout>
      <Container className="d-flex align-items-center h-100 mt-5">
        <Tournaments />
      </Container>
    </Layout>
  );
}
