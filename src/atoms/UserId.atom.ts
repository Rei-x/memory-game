import { db } from '@/services/database';
import { ref, off, update, onDisconnect } from 'firebase/database';
import { usePresence } from 'framer-motion';
import { atom, AtomEffect } from 'recoil';

export interface User {
  nickname: string;
  isOnline: boolean;
  avatar?: string;
}

export const userAtom = atom<User | null>({
  key: `user`,
  default: null,
});

const updatePresence =
  (): AtomEffect<string | null> =>
  ({ onSet }) => {
    onSet((newValue, oldValue) => {
      if (typeof oldValue === `string`) {
        const userRef = ref(db, `users/${oldValue}`);
        off(userRef);
        update(userRef, {
          isOnline: false,
        });
      }
      if (typeof newValue === `string`) {
        const userRef = ref(db, `users/${newValue}`);
        update(userRef, {
          isOnline: true,
        });
        onDisconnect(userRef).update({
          isOnline: false,
        });
      }
    });
  };

export const userIdAtom = atom<string | null>({
  key: `userId`,
  default: null,
  effects: [updatePresence()],
});
