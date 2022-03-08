import { correctCardsAtom } from '@/atoms/Card.atom';
import { CloudinaryImage } from '@/types/cloudinaryImages';
import { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';

export const useIsCardCorrect = (image: CloudinaryImage): boolean => {
  const correctCards = useRecoilValue(correctCardsAtom);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    const isGuessed = () => {
      return correctCards.includes(image);
    };
    setIsCorrect(isGuessed());
  }, [correctCards, image]);

  return isCorrect;
};
