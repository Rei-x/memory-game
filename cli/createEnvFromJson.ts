import configJson from '../firebaseConfig.json';

process.env[`FIREBASE_CONFIG`] = JSON.stringify(configJson);

console.log(`FIREBASE_CONFIG=${process.env[`FIREBASE_CONFIG`]}`);
console.log(`Paste this into your .env.local`);
