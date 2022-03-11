import { db } from '@/services/database';
import { ref, onValue, off, get, set, update } from 'firebase/database';
import { atom, AtomEffect, DefaultValue } from 'recoil';
import Cookie from 'js-cookie';
interface User {
  id: string;
  data: {
    nickname: string;
    isOnline: boolean;
    avatar?: string;
  };
}

const syncUser =
  (): AtomEffect<null | User> =>
  ({ setSelf, trigger, onSet }) => {
    if (typeof window === `undefined`) return;

    const handleReset = (
      newValue: User | null,
      oldValue: User | DefaultValue | null,
    ) => {
      console.log(`wylogowanko`);
      localStorage.removeItem(`userId`);
      Cookie.remove(`userId`);

      if (oldValue !== null && !(oldValue instanceof DefaultValue)) {
        const oldRef = ref(db, `users/${oldValue.id}`);
        off(oldRef);
        update(oldRef, {
          isOnline: false,
        });
      }
      setSelf(null);
    };

    const handleNewId = (
      newValue: User,
      oldValue: User | DefaultValue | null,
    ) => {
      localStorage.setItem(`userId`, newValue.id);
      Cookie.set(`userId`, newValue.id);

      if (oldValue !== null && !(oldValue instanceof DefaultValue)) {
        const oldRef = ref(db, `users/${oldValue.id}`);
        off(oldRef);
      }

      const userRef = ref(db, `users/${newValue.id}`);
      onValue(userRef, (snapshot) => {
        setSelf({
          id: snapshot.key!,
          data: snapshot.val(),
        });
      });
    };

    onSet((newValue, oldValue) => {
      if (newValue === null) {
        handleReset(newValue, oldValue);
        return;
      }

      if (
        oldValue === null ||
        oldValue instanceof DefaultValue ||
        newValue.id !== oldValue.id
      ) {
        handleNewId(newValue, oldValue);
      }

      if (
        oldValue instanceof DefaultValue ||
        newValue.data !== oldValue?.data
      ) {
        const userRef = ref(db, `users/${newValue.id}`);
        set(userRef, newValue.data);
      }
    });

    const id = localStorage.getItem(`userId`);
    if (id === null) return;

    const userRef = ref(db, `users/${id}`);
    onValue(userRef, (snapshot) => {
      setSelf({
        id: snapshot.key!,
        data: snapshot.val(),
      });
    });

    if (trigger === `get`) {
      const setUser = async () => {
        const user = await get(userRef);
        setSelf({
          id: user.key!,
          data: user.val(),
        });
      };
      setUser();
    }

    return () => {
      off(userRef);
    };
  };

export const userAtom = atom<User | null>({
  key: `user`,
  default: null,
  effects: [syncUser()],
});
