import { userAtom } from '@/atoms/User.atom';
import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useRecoilState } from 'recoil';
import NextImage from 'next/image';
import { useRouter } from 'next/router';

const CustomNavbar = () => {
  const [user, setUser] = useRecoilState(userAtom);
  const router = useRouter();

  return (
    <Navbar bg="light" variant="light">
      <Container>
        <NextImage
          className="me-auto"
          src="/logo.png"
          height={37}
          width={174}
          quality={100}
        />
        <Nav className="ms-auto">
          <Nav.Link href="#home">{user && user.data.nickname}</Nav.Link>
          <Button
            onClick={() => {
              setUser(null);
              router.push(`/login`);
            }}
          >
            Wyloguj
          </Button>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
