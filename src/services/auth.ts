import { app } from '@/firebase';
import { getAuth, GithubAuthProvider, signInWithPopup } from 'firebase/auth';

export const auth = getAuth(app);

const provider = new GithubAuthProvider();

export const adminLogin = () => signInWithPopup(auth, provider);
