import { Resource } from '@/types/cloudinaryImages';
import React, { useEffect, useState } from 'react';
import NextImage from 'next/image';
import { motion } from 'framer-motion';
import styles from './Card.module.scss';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { correctCardsAtom, selectedCardsAtom } from '@/atoms/Board';

const variants = {
  normal: {
    rotateY: 0,
  },
  turned: {
    rotateY: `180deg`,
  },
};

const Card = ({ image }: { image: Resource }) => {
  const [selectedCards, setSelectedCards] = useRecoilState(selectedCardsAtom);
  const [isTurned, setIsTurned] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const correctCards = useRecoilValue(correctCardsAtom);

  useEffect(() => {
    const isGuessed = () => {
      return correctCards.includes(image);
    };
    setIsCorrect(isGuessed());
  }, [correctCards, image]);

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
  }, [image, image.asset_id, isCorrect, selectedCards]);

  const onClick = () => {
    if (isCorrect) return;

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
      key={image.asset_id}
      className={`rounded ${styles.card} ${isCorrect && styles.inactive}`}
      variants={variants}
      animate={isTurned ? `turned` : `normal`}
      transition={{ duration: 0.2 }}
      onClick={() => onClick()}
    >
      <div className={`${styles.cardFace}`}>
        <NextImage
          draggable={false}
          src={`https://t3.ftcdn.net/jpg/03/35/13/14/360_F_335131435_DrHIQjlOKlu3GCXtpFkIG1v0cGgM9vJC.jpg`}
          width="80"
          height="80"
        />
      </div>
      <div className={`${styles.cardFace} ${styles.cardBackFace}`}>
        <NextImage draggable={false} src={image.url} width="80" height="80" />
      </div>
    </motion.div>
  );
};

export default Card;
