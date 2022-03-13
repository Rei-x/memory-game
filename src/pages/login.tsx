import { userListAtom } from '@/atoms/UserList.atom';
import React, { useEffect, useState } from 'react';
import { Button, Container, Modal } from 'react-bootstrap';
import { useRecoilState, useRecoilValue } from 'recoil';
import cloudinary from 'cloudinary';
import { Images } from '@/types/cloudinaryImages';
import UserInfo from '@/components/User';
import { selectedUserAtom } from '@/atoms/SelectedUser.atom';
import { useRouter } from 'next/router';
import { GetStaticProps } from 'next';
import { useUser } from '@/hooks/useUser';

const Login = ({ images }: { images: Images }) => {
  const users = useRecoilValue(userListAtom);
  const [showUsers, setShowUsers] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useRecoilState(selectedUserAtom);
  const { setUserId, userId } = useUser();
  const router = useRouter();

  const getImageUrl = (username: string) => {
    return images.resources.find((image) =>
      image.public_id.startsWith(`users/${username}`),
    )?.url;
  };

  const loginUser = () => {
    if (users === null || selectedUser === null) return;

    setUserId(selectedUser);
  };

  useEffect(() => {
    // Fix for React Hydration error
    if (users) setShowUsers(true);
    else setShowUsers(false);
  }, [users]);

  useEffect(() => {
    router.prefetch(`/`);
    if (userId !== null) {
      router.push(`/`);
    }
  }, [router, userId]);

  return (
    <Container className="mt-5 text-center">
      <h1>Choose your character!</h1>
      <div className="d-flex flex-column justify-content-center align-items-center">
        {showUsers && users ? (
          Object.entries(users).map(([id, user]) => (
            <UserInfo
              showModal={() => setShowModal(true)}
              key={id}
              id={id}
              user={user}
              url={
                getImageUrl(user.avatar || id) ||
                `https://t3.ftcdn.net/jpg/03/35/13/14/360_F_335131435_DrHIQjlOKlu3GCXtpFkIG1v0cGgM9vJC.jpg`
              }
            />
          ))
        ) : (
          <div>Loading</div>
        )}
      </div>
      <Modal centered show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Uwaga</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Wybrałxś <b>{selectedUser}</b>. To na pewno Ty?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowModal(false);
              setTimeout(() => setSelectedUser(null), 500);
            }}
          >
            Jednak nie
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setShowModal(false);
              loginUser();
            }}
          >
            Tak, to ja
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const images = (await cloudinary.v2.api.resources(
    {
      max_results: 10,
      type: `upload`,
      prefix: `users`,
    },
    (err, result) => result,
  )) as Images;
  images.rate_limit_reset_at = null;
  return {
    props: {
      images,
    },
  };
};

export default Login;
