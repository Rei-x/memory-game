import React from 'react';
import { Container } from 'react-bootstrap';
import Navbar from './Navbar';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <Container className="mt-2">{children}</Container>
    </>
  );
};

export default Layout;
