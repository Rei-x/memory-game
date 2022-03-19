import Layout from '@/components/Layout';
import { useUser } from '@/hooks/useUser';
import { db } from '@/services/database';
import { onChildAdded, ref, remove } from 'firebase/database';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useObject } from 'react-firebase-hooks/database';

const Lobby = ({
  tournamentId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [tournament] = useObject(ref(db, `tournament/${tournamentId}`));
  const { isAuthed, userId } = useUser();
  const router = useRouter();

  useEffect(() => {
    const tournamentVal = tournament?.val();

    if (!tournamentVal || !userId) return;

    const players = tournamentVal.players;

    if (!players || !Object.keys(players).includes(userId)) {
      router.push(`/`);
    }
  }, [router, tournament, userId]);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (!url.startsWith(`/game`)) {
        const userRef = ref(db, `tournament/${tournamentId}/players/${userId}`);
        remove(userRef);
      }
    };
    router.events.on(`routeChangeStart`, handleRouteChange);
    return () => {
      router.events.off(`routeChangeStart`, handleRouteChange);
    };
  }, [router.events, tournamentId, userId]);

  useEffect(() => {
    if (!isAuthed) {
      router.push(`/login`);
    }
  }, [isAuthed, router]);

  useEffect(() => {
    const gameRef = ref(db, `games/${tournamentId}`);
    const unsubscribe = onChildAdded(gameRef, (game, previousGame) => {
      if (!previousGame) {
        router.push(`/game/${tournamentId.replaceAll(` `, `-`)}/${game.key}`);
      }
    });
    return () => unsubscribe();
  }, [router, tournamentId]);

  return (
    <Layout>
      <Container>
        <h1>{tournamentId}</h1>
        <h3>Gracze</h3>
        <ul>
          {tournament &&
            tournament?.val().players &&
            Object.keys(tournament?.val().players).map((nickname) => (
              <li key={nickname}>{nickname}</li>
            ))}
        </ul>
      </Container>
    </Layout>
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

export default Lobby;
