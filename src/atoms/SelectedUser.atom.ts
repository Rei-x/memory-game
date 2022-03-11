import { atom } from 'recoil';

export const selectedUserAtom = atom<string | null>({
  key: `selectedUser`,
  default: null,
});
