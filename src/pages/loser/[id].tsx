import Layout from '@/components/Layout';
import Scoreboard from '@/components/Scoreboard';
import { useUser } from '@/hooks/useUser';
import { db } from '@/services/database';
import { capitalizeFirstLetter } from '@/utils/capitalizeFirstLetter';
import { ref } from 'firebase/database';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useObjectVal } from 'react-firebase-hooks/database';

const Loser = ({ tournamentId }: { tournamentId: string }) => {
  const { userId } = useUser();
  const [winner] = useObjectVal(ref(db, `winners/${tournamentId}`));
  const router = useRouter();

  useEffect(() => {
    if (winner) {
      router.push(`/winner/${tournamentId}`);
    }
  }, [router, tournamentId, winner]);

  return (
    <Layout>
      <h1>
        {` `}
        Dzięki za gierkę <b>{capitalizeFirstLetter(userId || ``)}</b>
      </h1>
      <p>Tutaj masz na bieżąco wyniki</p>
      <Scoreboard tournamentId={tournamentId} />
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

export default Loser;
