import fs from 'fs';

console.log(__dirname);

const data = fs.readFileSync(`${__dirname}/../firebaseConfig.json`);

const env = data.toString().replaceAll(` `, ``).replaceAll(`\n`, ``);

console.log(`Paste this into your .env.local`);
console.log(`NEXT_PUBLIC_FIREBASE_CONFIG=${env}`);

const envToExport = `"` + env.replaceAll(`"`, `\\"`) + `"`;
console.log(`Use this in bash to set env variable`);
console.log(`NEXT_PUBLIC_FIREBASE_CONFIG=${envToExport}`);
