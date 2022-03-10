import { usersAtom } from '@/atoms/User.atom';
import React from 'react';
import { Container } from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import cloudinary from 'cloudinary';
import { Images } from '@/types/cloudinaryImages';
import UserInfo from '@/components/User';

const Login = ({ images }: { images: Images }) => {
  const users = useRecoilValue(usersAtom);

  const getImageUrl = (username: string) => {
    return images.resources.find((image) =>
      image.public_id.startsWith(`users/${username}`),
    )?.url;
  };

  return (
    <Container className="mt-5 text-center">
      <h1>Choose your character!</h1>
      <div className="d-flex flex-column justify-content-center align-items-center">
        {users &&
          Object.entries(users).map(([name, user]) => (
            <UserInfo
              key={name}
              username={name}
              user={user}
              url={
                getImageUrl(name) ||
                `https://t3.ftcdn.net/jpg/03/35/13/14/360_F_335131435_DrHIQjlOKlu3GCXtpFkIG1v0cGgM9vJC.jpg`
              }
            />
          ))}
      </div>
    </Container>
  );
};

export async function getStaticProps() {
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
}

export default Login;
