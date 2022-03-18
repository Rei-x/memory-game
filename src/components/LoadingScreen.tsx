import React from 'react';
import { Container, Spinner } from 'react-bootstrap';
import Logo from './Logo';

const LoadingScreen = () => {
  return (
    <Container className="vh-100 vw-100 justify-content-center align-items-center d-flex flex-column">
      <Logo scale={2} />
      <Spinner animation="border" variant="primary" />
    </Container>
  );
};

export default LoadingScreen;
