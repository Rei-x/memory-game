import { auth } from '@/services/auth';
import { db } from '@/services/database';
import {
  equalTo,
  orderByChild,
  push,
  query,
  ref,
  remove,
  serverTimestamp,
  set,
  update,
} from 'firebase/database';
import React from 'react';
import { Button, Container } from 'react-bootstrap';
import { useSignInWithGithub, useAuthState } from 'react-firebase-hooks/auth';
import { useList } from 'react-firebase-hooks/database';
import Randomstring from 'randomstring';
import { useRouter } from 'next/router';
import NextLink from 'next/link';

const Dashboard = () => {
  const [signInWithGithub] = useSignInWithGithub(auth);
  const [user] = useAuthState(auth);
  const [tournaments] = useList(ref(db, `tournament`));
  const [onlineUsers] = useList(
    query(ref(db, `users`), orderByChild(`isOnline`), equalTo(true)),
  );
  const router = useRouter();

  if (!user) {
    return <Button onClick={() => signInWithGithub()}>Zaloguj</Button>;
  }

  const startGame = async (tournamentId: string) => {
    const tournament = ref(db, `tournament/${tournamentId}`);
    await update(tournament, {
      isStarted: true,
    });
    const gamesRef = ref(db, `games/${tournamentId}`);

    const playersNames = Object.keys(
      tournaments?.find((tournament) => tournament.key === tournamentId)?.val()
        .players,
    );

    const players: Record<string, any> = {};
    playersNames.forEach((playerName) => {
      players[playerName] = {
        score: 0,
      };
    });

    await push(gamesRef, {
      seed: Randomstring.generate(10),
      players: players,
      started: serverTimestamp(),
      size: 10,
      hasEnded: false,
    });

    await router.push(`/admin/tournament/${tournamentId.replaceAll(` `, `-`)}`);
  };

  const stopGame = async (tournamentId: string) => {
    const tournament = ref(db, `tournament/${tournamentId}`);
    await update(tournament, {
      isStarted: false,
    });
  };

  return (
    <Container className="mt-5">
      <h1>Panel admina</h1>
      <pre>{JSON.stringify(user)}</pre>
      <div>
        <h3>Turnieje</h3>
        <ul>
          {tournaments?.map((data) => (
            <li key={data.key}>
              <NextLink
                href={`/admin/tournament/${data.key?.replaceAll(` `, `-`)}`}
                passHref
              >
                <a>
                  <h5 className="mt-3">{data.key}</h5>
                </a>
              </NextLink>
              <pre>{JSON.stringify(data.val())}</pre>
              {data.val().isStarted ? (
                <Button onClick={() => stopGame(data.key || ``)}>Stop</Button>
              ) : (
                <Button onClick={() => startGame(data.key || ``)}>Start</Button>
              )}
              <Button
                variant="success"
                className="ms-3"
                onClick={() => {
                  if (data.key) {
                    const canBeJoined = ref(
                      db,
                      `tournament/${data.key}/canBeJoin`,
                    );
                    set(canBeJoined, true);
                  }
                }}
              >
                Włącz dołączanie
              </Button>
              <Button
                variant="danger ms-3"
                onClick={() => {
                  if (confirm(`Na pewno chcesz go usunąć?`) && data.key) {
                    const gamesRef = ref(db, `games/${data.key}`);
                    const winnersRef = ref(db, `winners/${data.key}`);
                    const playersRef = ref(
                      db,
                      `tournament/${data.key}/players`,
                    );
                    const isStartedRef = ref(
                      db,
                      `tournament/${data.key}/isStarted`,
                    );
                    set(isStartedRef, false);
                    remove(gamesRef);
                    remove(winnersRef);
                    remove(playersRef);
                  }
                }}
              >
                Usuń
              </Button>
              <h6>Gracze</h6>
              <ul>
                {data.val().players &&
                  Object.keys(data.val().players).map((user) => (
                    <li className="mt-2" key={user}>
                      {user}
                      {` `}
                      <Button
                        onClick={() => {
                          const userRef = ref(
                            db,
                            `tournament/${data.key}/players/${user}`,
                          );
                          remove(userRef);
                        }}
                      >
                        Wyrzuć
                      </Button>
                    </li>
                  ))}
              </ul>
            </li>
          ))}
        </ul>
        <h3>Zalogowani</h3>
        <ul>
          {onlineUsers?.map((user) => (
            <li key={user.key}>
              {user.key}
              <Button
                className="ms-3"
                onClick={() => {
                  const userRef = ref(db, `users/${user.key}`);
                  update(userRef, {
                    isOnline: false,
                  });
                }}
              >
                Wyloguj
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
};

export default Dashboard;
