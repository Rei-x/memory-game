import fs from 'fs';

console.log(__dirname);

const data = fs.readFileSync(`${__dirname}/../firebaseConfig.json`);

process.env[`FIREBASE_CONFIG`] = data
  .toString()
  .replaceAll(` `, ``)
  .replaceAll(`\n`, ``);

console.log(`NEXT_PUBLIC_FIREBASE_CONFIG=${process.env[`FIREBASE_CONFIG`]}`);
console.log(`Paste this into your .env.local`);
