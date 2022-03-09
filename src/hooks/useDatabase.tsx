import { functions } from '@/services/database';
import React from 'react';

export const useDatabase = () => {
  return functions;
};
