import { User, userAtom } from '@/atoms/User.atom';
import { userIdAtom } from '@/atoms/UserId.atom';
import { db } from '@/services/database';
import { off, onDisconnect, onValue, ref, update } from 'firebase/database';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';

export const useUser = () => {
  const [userId, setUserId] = useRecoilState(userIdAtom);
  const [user, setRecoilUser] = useRecoilState(userAtom);

  const wrapSetUserId = (newUserId: string | null) => {
    if (newUserId === null) {
      const userRef = ref(db, `users/${userId}`);
      update(userRef, {
        isOnline: false,
      });
    }

    setUserId(newUserId);
  };

  useEffect(() => {
    if (!userId) return;

    const userRef = ref(db, `users/${userId}`);

    update(userRef, {
      isOnline: true,
    });

    onDisconnect(userRef).update({
      isOnline: false,
    });

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

  return {
    user,
    userId,
    setUser,
    setUserId: wrapSetUserId,
  };
};
