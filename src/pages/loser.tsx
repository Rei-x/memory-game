import Layout from '@/components/Layout';
import Scoreboard from '@/components/Scoreboard';
import { useUser } from '@/hooks/useUser';
import { capitalizeFirstLetter } from '@/utils/capitalizeFirstLetter';
import React from 'react';

const Loser = () => {
  const { userId } = useUser();

  return (
    <Layout>
      <h1>
        {' '}
        Dzięki za gierkę <b>{capitalizeFirstLetter(userId || ``)}</b>
      </h1>
      <p>Możesz wejść tutaj, żeby oglądać tabele wyników z turnieju:</p>
      <Scoreboard tournamentId="Testowy turniej" />
    </Layout>
  );
};

export default Loser;
