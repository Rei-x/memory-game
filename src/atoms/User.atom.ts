import { atom } from 'recoil';

export interface User {
  nickname: string;
  isOnline: boolean;
  avatar?: string;
}

export const userAtom = atom<User | null>({
  key: `user`,
  default: null,
});
