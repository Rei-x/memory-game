import Layout from '@/components/Layout';
import Scoreboard from '@/components/Scoreboard';
import { useUser } from '@/hooks/useUser';
import { capitalizeFirstLetter } from '@/utils/capitalizeFirstLetter';
import { GetServerSideProps } from 'next';
import React from 'react';

const Loser = ({ tournamentId }: { tournamentId: string }) => {
  const { userId } = useUser();

  return (
    <Layout>
      <h1>
        {` `}
        Dzięki za gierkę <b>{capitalizeFirstLetter(userId || ``)}</b>
      </h1>
      <p>Możesz wejść tutaj, żeby oglądać tabele wyników z turnieju:</p>
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
