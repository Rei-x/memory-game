import { useUser } from '@/hooks/useUser';
import { db } from '@/services/database';
import { equalTo, orderByChild, query, ref, set } from 'firebase/database';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useList } from 'react-firebase-hooks/database';

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
              <hr />
              <h3>{snapshot.key}</h3>
              <p>
                Gracze: <br />
                {snapshot.val().players &&
                  Object.keys(snapshot.val().players).join(`, `)}
              </p>
              <pre>{JSON.stringify(snapshot.val())}</pre>
              <Button onClick={() => joinTournament(snapshot.key || `luigi`)}>
                Dołącz
              </Button>
            </div>
          );
        })}
    </div>
  );
};

export default Tournaments;
