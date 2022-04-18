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
import { capitalizeFirstLetter } from '@/utils/capitalizeFirstLetter';

const Login = ({ images }: { images: Images }) => {
  const users = useRecoilValue(userListAtom);
  const [showUsers, setShowUsers] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useRecoilState(selectedUserAtom);
  const { setUserId, userId } = useUser();
  const router = useRouter();

  const getImageUrl = (username: string) => {
    return images.resources.find((image) =>
      image.public_id.startsWith(`characters/${username}`),
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
      <h1>Who are you 🤔</h1>
      <div className="d-flex justify-content-center align-items-center flex-wrap">
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
          <Modal.Title>Attention</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You chose <b>{capitalizeFirstLetter(selectedUser || ``)}</b>. Are you
          sure?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowModal(false);
              setTimeout(() => setSelectedUser(null), 500);
            }}
          >
            No
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setShowModal(false);
              loginUser();
            }}
          >
            Yes
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
      max_results: 15,
      type: `upload`,
      prefix: `characters`,
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
