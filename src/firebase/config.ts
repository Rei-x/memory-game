const config = process.env.NEXT_PUBLIC_FIREBASE_CONFIG;

if (config === undefined) {
  console.error(`Firebase config isn't specified in env variables.`);
  throw new Error();
}

const parsedConfig = JSON.parse(config);

export default parsedConfig;
