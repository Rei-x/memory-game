import { usersAtom } from '@/atoms/User.atom';
import React from 'react';
import { Container } from 'react-bootstrap';
import { useRecoilValue } from 'recoil';

const Login = () => {
  const users = useRecoilValue(usersAtom);

  return (
    <Container>
      {users &&
        Object.entries(users).map(([name, user]) => (
          <div key={name}>
            {name} {user.isOnline ? `online` : `offline`}
          </div>
        ))}
    </Container>
  );
};

export default Login;
