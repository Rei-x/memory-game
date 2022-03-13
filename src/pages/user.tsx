import { useUser } from '@/hooks/useUser';
import React from 'react';
import { Container } from 'react-bootstrap';

const Firebase = () => {
  const { user } = useUser();

  return (
    <Container>
      User
      <pre>{JSON.stringify(user)}</pre>
    </Container>
  );
};

export default Firebase;
