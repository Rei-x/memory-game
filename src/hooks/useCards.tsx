import { Images, CloudinaryImage } from '@/types/cloudinaryImages';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';

const shuffleArray = (array: any[]) => {
  const newArray = JSON.parse(JSON.stringify(array)) as any[];
  newArray.sort(() => 0.5 - Math.random());
  return newArray;
};

export const useCards = (
  images: Images,
): [CloudinaryImage[], Dispatch<SetStateAction<CloudinaryImage[]>>] => {
  const firstCards = useMemo<CloudinaryImage[]>(
    () =>
      images.resources.map((card) => ({
        ...card,
        asset_id: `${card.asset_id}-1`,
      })),
    [images],
  );

  const secondCards = useMemo<CloudinaryImage[]>(
    () =>
      images.resources.map((card) => ({
        ...card,
        asset_id: `${card.asset_id}-2`,
      })),
    [images],
  );

  const [cards, setCards] = useState(
    shuffleArray([...firstCards, ...secondCards]),
  );

  return [cards, setCards];
};
