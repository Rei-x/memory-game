import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import NextImage from 'next/image';
import { useRouter } from 'next/router';
import { useUser } from '@/hooks/useUser';
import { useSetRecoilState } from 'recoil';
import { userIdAtom } from '@/atoms/UserId.atom';

const CustomNavbar = () => {
  const [user] = useUser();
  const setUserId = useSetRecoilState(userIdAtom);
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
          <Nav.Link href="#home">{user && user.nickname}</Nav.Link>
          <Button
            onClick={() => {
              setUserId(null);
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
