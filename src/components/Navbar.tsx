import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import NextImage from 'next/image';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useUser } from '@/hooks/useUser';

const CustomNavbar = () => {
  const { user, setUserId } = useUser();
  const router = useRouter();

  return (
    <Navbar bg="light" variant="light">
      <Container>
        <NextLink href="/" passHref>
          <a>
            <NextImage
              className="me-auto"
              src="/logo.png"
              height={37}
              width={174}
              quality={100}
            />
          </a>
        </NextLink>
        <Nav className="ms-auto">
          <Nav.Link>{user && user.nickname}</Nav.Link>
          <Button
            onClick={() => {
              setUserId(null);
              router.push(`/login`);
            }}
          >
            Logout
          </Button>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
