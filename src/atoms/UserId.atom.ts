import { atom, AtomEffect } from 'recoil';
import Cookies from 'js-cookie';

const persistStorage =
  (): AtomEffect<string | null> =>
  ({ onSet, setSelf }) => {
    if (typeof window !== `undefined`) {
      const userId = localStorage.getItem(`userId`);

      if (userId) {
        setSelf(userId);
        Cookies.set(`userId`, userId);
      } else {
        Cookies.remove(`userId`);
      }
    }
    onSet((newUserId) => {
      if (newUserId) {
        localStorage.setItem(`userId`, newUserId);
        Cookies.set(`userId`, newUserId);
      } else {
        localStorage.removeItem(`userId`);
        Cookies.remove(`userId`);
      }
    });
  };

export const userIdAtom = atom<string | null>({
  key: `userId`,
  default: null,
  effects: [persistStorage()],
});
