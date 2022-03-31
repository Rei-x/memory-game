<div align="center">
  <img src="https://i.imgur.com/jmjBz5d.png" alt="Kajtek party">
</div>

<br />

<div align="center"><strong>Multiplayer memory game</strong></div>
<div align="center">Like title says, it's multiplayer memory game, that can be used at a party to make it more fun!</div>

<br /> 

<br />

## Features

- ⚡ Realtime updates
- 🥳 Simple login screen, click and play!
- 📷 Personalized photos on cards
- 🛠 Admin panel
- ✅ Live updated scoreboard of players
- 👀 Multiple games at one time

## How to run it?

1. Rename `.env.local.example` to `.env.local` <br />
You need cloudinary account to supply website with photos for users and cards. Get your API secret, API key and API cloud name and fill `.env.local` file with them.
2. Create Firebase Project or use existing one. <br/>
Create `firebaseConfig.json` file in root directory and fill it with JSON data from your firebase config, here is an example, how it should look: 
<details><summary><b>firebaseConfig.json</b></summary>

```json
{
  "apiKey": "AIzaSyCDwoHf3kcHn5zdFDScAcxf4Kq0xz6Nvg",
  "authDomain": "memory-game.firebaseapp.com",
  "databaseURL": "https://memory-game-default-rtdb.europe-west1.firebasedatabase.app",
  "projectId": "memory-game",
  "storageBucket": "memory-game.appspot.com",
  "messagingSenderId": "453582340732",
  "appId": "1:453582340732:web:6a658a61g431e774c2f9f9",
  "measurementId": "G-H5SHPORBJ1"
}
```
</details>

3. Run `npx ts-node cli/createEnvFromJson.ts`, then copy and paste `NEXT_PUBLIC_FIREBASE_CONFIG` to yours `env.local` file.

4. Run `npm install`
5. There we go! Run `npm run dev` launch app!

### Requirements

- Node.js >= 12.22.0
- NPM 2

### Scripts

- `npm run dev` — Starts the application in development mode at `http://localhost:3000`.
- `npm run build` — Creates an optimized production build of your application.
- `npm start` — Starts the application in production mode.
- `npm run type-check` — Validate code using TypeScript compiler.
- `npm run lint` — Runs ESLint for all files in the `src` directory.
- `npm run format` — Runs Prettier for all files in the `src` directory.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for more information.
