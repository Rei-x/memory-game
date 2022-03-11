import { db } from '@/services/database';
import { get, off, onValue, ref } from 'firebase/database';
import { atom, AtomEffect } from 'recoil';

export interface UserInList {
  isOnline: boolean;
  nickname: string;
  avatar?: string;
}

const syncUsers =
  (): AtomEffect<null | Record<string, UserInList>> =>
  ({ setSelf, trigger }) => {
    const userListRef = ref(db, `users`);
    const setUsers = async () => {
      const user = await get(userListRef);
      setSelf(user.val() as unknown as Promise<Record<string, UserInList>>);
    };

    if (trigger === `get`) {
      setUsers();
    }

    onValue(userListRef, (snapshot) => {
      setSelf(snapshot.val());
    });

    return () => {
      off(userListRef);
    };
  };

export const userListAtom = atom({
  key: `users`,
  default: null,
  effects: [syncUsers()],
});
