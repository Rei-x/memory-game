import { CloudinaryImage } from '@/types/cloudinaryImages';
import { atom, DefaultValue, selector } from 'recoil';

interface SelectedCards {
  first: CloudinaryImage | null;
  second: CloudinaryImage | null;
}

const selectedCardsAtom = atom<SelectedCards>({
  key: `cards`,
  default: {
    first: null,
    second: null,
  },
});

export const correctCardsAtom = atom<CloudinaryImage[]>({
  key: `correctCards`,
  default: [] as CloudinaryImage[],
});

export const selectedCards = selector({
  key: `selectedCards`,
  get: ({ get }) => {
    return get(selectedCardsAtom);
  },
  set: ({ set }, cards: SelectedCards | DefaultValue) => {
    if (cards instanceof DefaultValue) {
      set(selectedCardsAtom, cards);
      return;
    }

    if (cards.first !== null && cards.second !== null) {
      if (cards.first.url === cards.second.url) {
        set(
          correctCardsAtom,
          (oldCards) =>
            [...oldCards, cards.first, cards.second] as CloudinaryImage[],
        );
      }
    }

    set(selectedCardsAtom, cards);
  },
});
