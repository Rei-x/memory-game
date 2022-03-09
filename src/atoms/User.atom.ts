import { db } from '@/services/database';
import { get, off, onValue, ref } from 'firebase/database';
import { atom, AtomEffect } from 'recoil';

interface User {
  isOnline: boolean;
}

const syncUsers =
  (): AtomEffect<null | Record<string, User>> =>
  ({ setSelf, trigger }) => {
    const userRef = ref(db, `users`);
    const setUser = async () => {
      const user = await get(userRef);
      setSelf(user.val() as unknown as Promise<null>);
    };

    if (trigger === `get`) {
      setUser();
    }

    onValue(userRef, (snapshot) => {
      setSelf(snapshot.val());
    });

    return () => {
      off(userRef);
    };
  };

export const usersAtom = atom({
  key: `users`,
  default: null,
  effects: [syncUsers()],
});
