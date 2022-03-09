import { correctCardsAtom } from '@/atoms/Card.atom';
import { CloudinaryImage } from '@/types/cloudinaryImages';
import { useRecoilValue } from 'recoil';

export const useCheckForWin = (cards: CloudinaryImage[]) => {
  const correctCards = useRecoilValue(correctCardsAtom);
  return correctCards.length === cards.length;
};
