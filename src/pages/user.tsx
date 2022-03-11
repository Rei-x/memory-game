import React from 'react';
import { Container } from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import { userAtom } from '@/atoms/User.atom';

const Firebase = () => {
  const data = useRecoilValue(userAtom);

  return (
    <Container>
      User
      <pre>{JSON.stringify(data)}</pre>
    </Container>
  );
};

export default Firebase;
