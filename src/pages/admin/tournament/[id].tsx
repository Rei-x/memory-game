import { db } from '@/services/database';
import { ref, serverTimestamp, push, remove } from 'firebase/database';
import { GetServerSideProps } from 'next';
import React, { useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import { useList } from 'react-firebase-hooks/database';
import Randomstring from 'randomstring';
import Scoreboard from '@/components/Scoreboard';

const Tournament = ({ tournamentId }: { tournamentId: string }) => {
  const [games] = useList(ref(db, `games/${tournamentId}`));
  const gamesRef = ref(db, `games/${tournamentId}`);
  const [playersInNextGame, setPlayersInNextGame] = useState<string[]>([]);

  const startNextGame = async () => {
    const players: Record<string, any> = {};
    playersInNextGame.forEach((playerName) => {
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
  };

  return (
    <Container>
      <h1>{tournamentId}</h1>
      <h2>Games</h2>
      <div>
        {games &&
          games.map((game) => (
            <div key={game.key}>
              <hr />
              <h3>{game.key}</h3>
              <pre>{JSON.stringify(game.val())}</pre>
              <Button
                className="mb-3"
                onClick={() => {
                  const gameRef = ref(db, `games/${tournamentId}/${game.key}`);
                  remove(gameRef);
                }}
              >
                Usuń
              </Button>
            </div>
          ))}
        {games && games?.length > 0 && (
          <div>
            <Button
              className={`${playersInNextGame.length === 0 && `disabled`}`}
              onClick={() => startNextGame()}
            >
              Następna gra
            </Button>
            <h5>Gracze w ostatniej grze</h5>
            <pre>{JSON.stringify(games[games.length - 1].val().players)}</pre>
            <ul>
              {Object.keys(games[games.length - 1].val().players).map(
                (playerName) => (
                  <li key={playerName}>
                    {playerName}
                    <Button
                      className="ms-2"
                      onClick={() =>
                        setPlayersInNextGame((oldPlayers) => [
                          ...oldPlayers,
                          playerName,
                        ])
                      }
                    >
                      Dodaj
                    </Button>
                  </li>
                ),
              )}
            </ul>
            <hr />
            <h5>Gracze do nowej gry</h5>
            <ul>
              {playersInNextGame.map((playerName) => (
                <li key={playerName}>
                  {playerName}
                  <Button
                    className="ms-2"
                    onClick={() =>
                      setPlayersInNextGame((oldPlayers) =>
                        oldPlayers.filter(
                          (oldPlayerName) => oldPlayerName !== playerName,
                        ),
                      )
                    }
                  >
                    Usuń
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <Scoreboard tournamentId={tournamentId} />
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };

  const tournamentId =
    typeof id === `string` ? id.replace(/-/i, ` `) : `undefined`;

  return {
    props: {
      tournamentId,
    },
  };
};

export default Tournament;
