import Layout from '@/components/Layout';
import Scoreboard from '@/components/Scoreboard';
import { capitalizeFirstLetter } from '@/utils/capitalizeFirstLetter';
import { GetServerSideProps } from 'next';
import React from 'react';

const ScorePage = ({ tournamentId }: { tournamentId: string }) => {
  return (
    <Layout>
      <h1>{capitalizeFirstLetter(tournamentId)}</h1>
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

export default ScorePage;
