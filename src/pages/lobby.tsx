import Tournaments from '@/components/Tournaments';
import React from 'react';
import { Container } from 'react-bootstrap';
import Layout from '@/components/Layout';

const Lobby = () => {
  return (
    <Layout>
      <Container>
        <Tournaments />
      </Container>
    </Layout>
  );
};

export default Lobby;
