import { User, userAtom, userIdAtom } from '@/atoms/UserId.atom';
import { db } from '@/services/database';
import { off, onValue, ref, update } from 'firebase/database';
import { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

export const useUser = (): [User | null, (data: Partial<User>) => void] => {
  const userId = useRecoilValue(userIdAtom);
  const [user, setRecoilUser] = useRecoilState(userAtom);

  useEffect(() => {
    if (!userId) return;

    const userRef = ref(db, `users/${userId}`);
    onValue(userRef, (snapshot) => {
      setRecoilUser(snapshot.val());
    });
    return () => off(userRef);
  }, [setRecoilUser, userId]);

  const setUser = (data: Partial<User>) => {
    if (!userId) return;

    const userRef = ref(db, `users/${userId}`);
    update(userRef, data);
  };

  return [user, setUser];
};
