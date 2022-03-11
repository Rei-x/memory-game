import { CloudinaryImage } from '@/types/cloudinaryImages';
import React, { useEffect, useState } from 'react';
import NextImage from 'next/image';
import { motion } from 'framer-motion';
import styles from './Card.module.scss';
import { useRecoilState } from 'recoil';
import { selectedCards as selectedCardsSelector } from '@/atoms/Card.atom';
import { useIsCardCorrect } from '@/hooks/useIsCardCorrect';

const variants = {
  normal: {
    rotateY: 0,
    transition: {
      duration: 0.3,
    },
  },
  turned: {
    rotateY: `180deg`,
    transition: {
      duration: 0.3,
    },
  },
};

const Card = ({ image }: { image: CloudinaryImage }) => {
  const [selectedCards, setSelectedCards] = useRecoilState(
    selectedCardsSelector,
  );
  const [isTurned, setIsTurned] = useState(false);
  const isCorrect = useIsCardCorrect(image);

  useEffect(() => {
    const isSelected = () => {
      if (
        selectedCards.first?.asset_id === image.asset_id ||
        selectedCards.second?.asset_id === image.asset_id
      ) {
        return true;
      }
      return false;
    };
    setIsTurned(isCorrect || isSelected());
  }, [image.asset_id, isCorrect, selectedCards]);

  const onClick = () => {
    if (isTurned) return;

    setSelectedCards(() => {
      if (selectedCards.first) {
        return {
          ...selectedCards,
          second: image,
        };
      } else {
        return {
          ...selectedCards,
          first: image,
        };
      }
    });
  };

  return (
    <motion.div
      layout
      layoutId={image.asset_id}
      key={image.asset_id}
      className={`rounded m-1 shadow ${styles.card} ${
        isCorrect && styles.inactive
      }`}
      variants={variants}
      animate={isTurned ? `turned` : `normal`}
      transition={{ duration: 1 }}
      onClick={() => onClick()}
    >
      <div className={`rounded ${styles.cardFace}`}>
        <NextImage
          className="rounded"
          draggable={false}
          src={`/questionmark.jpg`}
          width="80"
          height="80"
        />
      </div>
      <div className={`${styles.cardFace} ${styles.cardBackFace}`}>
        <NextImage
          className="rounded"
          draggable={false}
          src={image.url}
          width="80"
          height="80"
        />
      </div>
    </motion.div>
  );
};

export default Card;
