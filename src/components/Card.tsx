import { Resource } from '@/types/cloudinaryImages';
import React, { useState } from 'react';
import NextImage from 'next/image';
import { motion } from 'framer-motion';
import styles from './Card.module.scss';

const variants = {
  normal: {
    rotateY: 0,
  },
  turned: {
    rotateY: `180deg`,
  },
};

const Card = ({ image }: { image: Resource }) => {
  const [isTurned, setIsTurned] = useState(false);

  return (
    <motion.div
      key={image.asset_id}
      className={`rounded ${styles.card}`}
      variants={variants}
      animate={isTurned ? `turned` : `normal`}
      transition={{ duration: 0.2 }}
      onClick={() => setIsTurned(!isTurned)}
    >
      <div className={`${styles.cardFace}`}>
        <NextImage
          src={`https://t3.ftcdn.net/jpg/03/35/13/14/360_F_335131435_DrHIQjlOKlu3GCXtpFkIG1v0cGgM9vJC.jpg`}
          width="80"
          height="80"
        />
      </div>
      <div className={`${styles.cardFace} ${styles.cardBackFace}`}>
        <NextImage src={image.url} width="80" height="80" />
      </div>
    </motion.div>
  );
};

export default Card;
