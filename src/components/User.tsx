import React from 'react';
import NextImage from 'next/image';
import { UserInList } from '@/atoms/UserList.atom';
import styles from './User.module.scss';
import { useSetRecoilState } from 'recoil';
import { selectedUserAtom } from '@/atoms/SelectedUser.atom';
import { motion } from 'framer-motion';
import { capitalizeFirstLetter } from '@/utils/capitalizeFirstLetter';

const variants = {
  online: {
    opacity: 0.5,
  },
  offline: {
    opacity: 1,
  },
};

const UserInfo = ({
  url,
  user,
  id,
  showModal,
}: {
  url: string;
  user: UserInList;
  id: string;
  showModal: () => void;
}) => {
  const setSelectedUser = useSetRecoilState(selectedUserAtom);
  const handleClick = () => {
    if (user.isOnline) return;
    showModal();
    setSelectedUser(id);
  };

  return (
    <motion.div
      suppressHydrationWarning={true}
      animate={user.isOnline ? `online` : `offline`}
      transition={{
        duration: 0.2,
      }}
      variants={variants}
      className={`rounded mt-3 m-3 d-flex flex-column align-items-center`}
    >
      <NextImage
        src={url}
        alt="cat"
        className={`rounded shadow-lg pointer ${
          !user.isOnline && styles.pointer
        }`}
        width={`100px`}
        height={`100px`}
        onClick={handleClick}
      />
      <h6 className="mt-1">{capitalizeFirstLetter(user.nickname)}</h6>
    </motion.div>
  );
};

export default UserInfo;
