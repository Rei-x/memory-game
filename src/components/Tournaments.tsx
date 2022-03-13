import { useUser } from '@/hooks/useUser';
import { db } from '@/services/database';
import { equalTo, orderByChild, query, ref, set } from 'firebase/database';
import React from 'react';
import { Button } from 'react-bootstrap';
import { useList } from 'react-firebase-hooks/database';

const Tournaments = () => {
  const [tournaments] = useList(
    query(ref(db, `tournament`), orderByChild(`canBeJoin`), equalTo(true)),
  );
  const { userId } = useUser();

  const joinTournament = (id: string) => {
    const tournamentRef = ref(db, `tournament/${id}/players/${userId}`);
    set(tournamentRef, true);
  };

  return (
    <div>
      {tournaments &&
        tournaments?.map((snapshot) => {
          return (
            <div key={snapshot.key}>
              <h3>{snapshot.key}</h3>
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
