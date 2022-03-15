import { auth } from '@/services/auth';
import { db } from '@/services/database';
import {
  equalTo,
  orderByChild,
  query,
  ref,
  remove,
  update,
} from 'firebase/database';
import React from 'react';
import { Button, Container } from 'react-bootstrap';
import { useSignInWithGithub, useAuthState } from 'react-firebase-hooks/auth';
import { useList } from 'react-firebase-hooks/database';

const Dashboard = () => {
  const [signInWithGithub] = useSignInWithGithub(auth);
  const [user] = useAuthState(auth);
  const [tournaments] = useList(ref(db, `tournament`));
  const [onlineUsers] = useList(
    query(ref(db, `users`), orderByChild(`isOnline`), equalTo(true)),
  );

  if (!user) {
    return <Button onClick={() => signInWithGithub()}>Zaloguj</Button>;
  }

  const startGame = (tournamentId: string) => {
    const tournament = ref(db, `tournament/${tournamentId}`);
    update(tournament, {
      isStarted: true,
    });
  };

  const stopGame = (tournamentId: string) => {
    const tournament = ref(db, `tournament/${tournamentId}`);
    update(tournament, {
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
              <h5 className="mt-3">{data.key}</h5>
              <pre>{JSON.stringify(data.val())}</pre>
              {data.val().isStarted ? (
                <Button onClick={() => stopGame(data.key || ``)}>Stop</Button>
              ) : (
                <Button onClick={() => startGame(data.key || ``)}>Start</Button>
              )}
              <h6>Gracze</h6>
              <ul>
                {data.val().players &&
                  Object.keys(data.val().players).map((user) => (
                    <li className="mt-2" key={user}>
                      {user}{' '}
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
