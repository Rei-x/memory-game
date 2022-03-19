import { db } from '@/services/database';
import { differenceInSeconds } from 'date-fns';
import { limitToLast, query, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { useObjectVal } from 'react-firebase-hooks/database';
import { motion } from 'framer-motion';
import LoadingScreen from './LoadingScreen';
import { Table } from 'react-bootstrap';

const Scoreboard = ({ tournamentId }: { tournamentId: string }) => {
  const [gameVal, loading] = useObjectVal(
    query(ref(db, `games/${tournamentId}`), limitToLast(1)),
  );
  const [game, setGame] = useState<any | null>(null);
  const [players, setPlayers] = useState<any | null>(null);

  const [currentTimeStamp, setCurrentTimeStamp] = useState(
    new Date().getTime(),
  );

  useEffect(() => {
    if (gameVal) setGame(Object.values(gameVal)[0] as any);
  }, [gameVal]);

  useEffect(() => {
    const interval = setInterval(
      () => setCurrentTimeStamp(new Date().getTime()),
      1000,
    );
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (game)
      setPlayers(
        Object.keys(game.players)
          .map((player) => {
            return {
              name: player,
              ...game.players[player],
            };
          })
          .sort((a, b) => {
            console.log(a, b);
            if (a.score > b.score) return -1;
            if (a.score < b.score) return 1;
            if (a?.ended && !b?.ended) return -1;
            if (!a?.ended && b?.ended) return 1;
            if (a.ended && b.ended) {
              if (a.ended < b.ended) {
                return -1;
              }
              if (a.ended > b.ended) {
                return 1;
              }
            }
            return 1;
          }),
      );
  }, [game]);

  if (loading || !game) {
    return <LoadingScreen />;
  }

  return (
    <div>
      <h1>Tabela</h1>
      {game && (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>zawodnik</th>
                <th>wynik</th>
                <th>czas</th>
              </tr>
            </thead>
            <tbody>
              {players &&
                players.map((player: any, index: number) => (
                  <motion.tr
                    transition={{ duration: 0.3 }}
                    layout
                    key={player.name}
                  >
                    <td>{index + 1}</td>
                    <td>{player.name}</td>
                    <td>
                      {player.score}/{game.size}
                    </td>
                    <td>
                      {player?.ended
                        ? differenceInSeconds(player.ended, game.started)
                        : differenceInSeconds(currentTimeStamp, game.started)}
                    </td>
                  </motion.tr>
                ))}
            </tbody>
          </Table>
        </>
      )}
    </div>
  );
};

export default Scoreboard;
