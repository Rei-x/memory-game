import { initializeApp } from 'firebase/app';
import config from './config';

const firebaseConfig = config;

export const app = initializeApp(firebaseConfig);
