import { useUser } from '@/hooks/useUser';
import { db } from '@/services/database';
import { equalTo, orderByChild, query, ref, set } from 'firebase/database';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useList } from 'react-firebase-hooks/database';
import { AnimatePresence, motion } from 'framer-motion';

const Tournaments = () => {
  const [tournaments] = useList(
    query(ref(db, `tournament`), orderByChild(`canBeJoin`), equalTo(true)),
  );
  const { userId, isAuthed } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthed) {
      router.push(`/login`);
    }
  }, [isAuthed, router]);

  const joinTournament = (id: string) => {
    const tournamentRef = ref(db, `tournament/${id}/players/${userId}`);
    set(tournamentRef, true);
    router.push(`/lobby/${id.replaceAll(` `, `-`)}`);
  };

  return (
    <div>
      {tournaments &&
        tournaments?.map((snapshot) => {
          return (
            <div key={snapshot.key}>
              <h3>{snapshot.key}</h3>
              <p>Gracze</p>
              <div className="d-flex flex-wrap" style={{ gap: `10px` }}>
                <AnimatePresence>
                  {snapshot.val().players &&
                    Object.keys(snapshot.val().players).map((playerName) => (
                      <motion.div
                        layout
                        key={playerName}
                        initial={{ opacity: 0, scale: 0 }}
                        transition={{ duration: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        layoutId={playerName}
                      >
                        <b>{playerName} </b>
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>
              {snapshot.val().isStarted ? (
                <Button
                  className="mt-3"
                  variant="success"
                  onClick={() => {
                    router.push(
                      `/scoreboard/${snapshot.key?.replaceAll(` `, `-`)}`,
                    );
                  }}
                >
                  Tabela
                </Button>
              ) : (
                <Button
                  onClick={() => joinTournament(snapshot.key || `luigi`)}
                  className="mt-3"
                >
                  Dołącz
                </Button>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default Tournaments;
