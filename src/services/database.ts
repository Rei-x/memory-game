import { getDatabase, ref, set } from 'firebase/database';
import { app } from '@/firebase';

export const db = getDatabase(app);

const setData = (path: string, data: any) => {
  set(ref(db, path), data);
};

export const functions = Object.freeze({
  setData,
});
