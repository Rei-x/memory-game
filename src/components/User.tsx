import React from 'react';
import NextImage from 'next/image';
import { User } from '@/atoms/User.atom';
import { Button } from 'react-bootstrap';

const UserInfo = ({
  url,
  user,
  username,
}: {
  url: string;
  user: User;
  username: string;
}) => {
  return (
    <div
      className={`shadow rounded p-3 mt-3 d-flex flex-column align-items-center ${
        user.isOnline && `opacity-50`
      }`}
      style={{ width: `250px` }}
    >
      <div>
        <NextImage
          src={url}
          alt="cat"
          className="rounded"
          width={`80px`}
          height={`80px`}
        />
      </div>
      <h3 className="mt-2">{username}</h3>
      <Button className="mt-2 w-50" disabled={user.isOnline}>
        To ja!
      </Button>
    </div>
  );
};

export default UserInfo;
