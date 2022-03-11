import { DataSnapshot } from 'firebase/database';

export const addIdToSnapshot = <T>(data: DataSnapshot) => {
  return {
    id: data.key,
    ...data.val(),
  } as T & {
    id: string;
  };
};
