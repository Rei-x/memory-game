import { Resource } from '@/types/cloudinaryImages';
import { atom } from 'recoil';

export const boardAtom = atom({
  key: `board`,
  default: {},
});

export const selectedCardsAtom = atom<{
  first: Resource | null;
  second: Resource | null;
}>({
  key: `cards`,
  default: {
    first: null,
    second: null,
  },
});

export const correctCardsAtom = atom<Resource[]>({
  key: `correctCards`,
  default: [] as Resource[],
});
